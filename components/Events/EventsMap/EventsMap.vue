<template>
    <!--
        MapKit JS map. Annotations come from one of two source modes:
          - 'events'  → one EventAnnotation per event, clustered when pins overlap
          - 'venues'  → one VenueAnnotation per venue
        The annotation factories live in this component so we can call
        Vue's `render(vnode, container)` to convert components to DOM nodes
        that MapKit will accept.
    -->
    <div ref="mapContainer" class="events-map"></div>
</template>

<script setup lang="ts">
import { createVNode, onMounted, onBeforeUnmount, ref, render, watch } from 'vue';
import { Event } from '~/data/models/EventModels';
import { Venue } from '~/data/models/VenueModels';
import { generateMapkitAuthToken } from '~/utils/map-helpers';

import VenueAnnotation from '@/components/Venues/VenueAnnotation/VenueAnnotation.vue';
import EventAnnotation from '@/components/Events/EventAnnotation/EventAnnotation.vue';

declare let mapkit: any;

const props = defineProps({
    /** Whether map pins should represent individual events or venues. */
    mode: { type: String as () => 'events' | 'venues', required: true },
    /** All events to consider for the events mode. */
    events: { type: Array as () => Event[], default: () => [] },
    /** All venues to consider for the venues mode. */
    venues: { type: Array as () => Venue[], default: () => [] },
    /**
     * Initial map center as [lng, lat]. Defaults to NYC if not provided so the
     * map at least renders something rather than going blank.
     */
    center: { type: Array as () => number[], default: () => [-73.9776, 40.7655] }
});

const emit = defineEmits<{
    (e: 'select-venue', venue: Venue): void;
    (e: 'select-event', event: Event): void;
    (e: 'select-event-cluster', events: Event[]): void;
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: any = null;
let currentAnnotations: any[] = [];

// ── Mapkit init + lifecycle ──────────────────────────────────────────────────

onMounted(async () => {
    if (!window.mapkit) {
        await loadMapKitJS();
    }
    if (!window.mapkit._initialized) {
        mapkit.init({
            authorizationCallback: (done: (token: string) => void) => {
                generateMapkitAuthToken().then((token) => done(token));
            },
            language: navigator.language
        });
        window.mapkit._initialized = true;
    }

    if (!mapContainer.value) return;

    const center = new mapkit.Coordinate(props.center[1], props.center[0]);
    map = new mapkit.Map(mapContainer.value, {
        center,
        showsZoomControl: false,
        showsUserLocation: true,
        tracksUserLocation: false,
        showsMapTypeControl: false,
        showsPointsOfInterest: false,
        showsCompass: mapkit.FeatureVisibility.Hidden,
    });
    map.colorScheme = mapkit.Map.ColorSchemes.Adaptive;

    map.addEventListener('select', handleAnnotationSelection);
    // Re-cluster when the user zooms — overlapping pins should collapse/expand
    // as the user changes resolution.
    map.addEventListener('region-change-end', renderAnnotations);

    renderAnnotations();
});

onBeforeUnmount(() => {
    if (map) {
        try {
            map.removeEventListener('select', handleAnnotationSelection);
            map.removeEventListener('region-change-end', renderAnnotations);
            map.destroy();
        } catch { /* map may already be torn down */ }
        map = null;
    }
});

async function loadMapKitJS(): Promise<void> {
    return new Promise((resolve, reject) => {
        if ((window as any).mapkit) { resolve(); return; }
        const script = document.createElement('script');
        script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load MapKit JS'));
        document.head.appendChild(script);
    });
}

// Re-render annotations whenever mode or source data changes.
watch(() => [props.mode, props.events, props.venues], () => {
    if (map) renderAnnotations();
}, { deep: true });

// ── Annotation rendering ─────────────────────────────────────────────────────

function clearAnnotations() {
    if (!map || currentAnnotations.length === 0) return;
    map.removeAnnotations(currentAnnotations);
    currentAnnotations = [];
}

function renderAnnotations() {
    if (!map) return;
    clearAnnotations();

    if (props.mode === 'venues') {
        renderVenuePins();
    } else {
        renderEventPins();
    }
}

// Venue pins are 1:1 with venues — no clustering needed.
function renderVenuePins() {
    const annotations: any[] = [];
    props.venues.forEach((v) => {
        const coords = v.location?.coordinates;
        if (!coords || coords.length < 2) return;
        const [lng, lat] = coords;

        const annotation = new mapkit.Annotation(
            new mapkit.Coordinate(lat, lng),
            (_coord: any, options: any) => {
                const container = document.createElement('div');
                const vnode = createVNode(VenueAnnotation, {
                    venue: options.data.venue,
                    hasEvents: false
                });
                render(vnode, container);
                const dom = container.firstElementChild as HTMLElement;
                container.remove();
                return dom;
            },
            {
                data: { kind: 'venue', venue: v },
                anchorOffset: new DOMPoint(0, -20)
            }
        );
        annotations.push(annotation);
    });
    if (annotations.length > 0) {
        map.addAnnotations(annotations);
        currentAnnotations = annotations;
    }
}

/**
 * Group events into clusters based on screen-space overlap at the current zoom.
 *
 * We bucket each event by a coordinate-quantization grid whose cell size scales
 * with the visible region span. Events that fall in the same cell render as a
 * single clustered pin with a count badge. Zooming in shrinks the cells, so
 * clusters split apart naturally; zooming out merges them back together.
 */
function renderEventPins() {
    if (!map) return;

    // Cell size in degrees ≈ 1/30th of the visible span. Tweak the divisor
    // to taste — higher means smaller cells (more pins, less clustering).
    const region = map.region;
    const cellSize = Math.max(region.span.latitudeDelta, region.span.longitudeDelta) / 30;

    type Cluster = { lat: number; lng: number; events: Event[] };
    const cells: Map<string, Cluster> = new Map();

    props.events.forEach((evt) => {
        // Pick the first venue with coordinates as the pin location for this event.
        const descriptor = evt.venues?.[0];
        const coords = descriptor?.location?.coordinates;
        if (!coords || coords.length < 2) return;
        const [lng, lat] = coords;

        const cellLat = Math.floor(lat / cellSize);
        const cellLng = Math.floor(lng / cellSize);
        const key = `${cellLat}:${cellLng}`;

        const existing = cells.get(key);
        if (existing) {
            existing.events.push(evt);
        } else {
            cells.set(key, { lat, lng, events: [evt] });
        }
    });

    const annotations: any[] = [];
    cells.forEach((cluster) => {
        const annotation = new mapkit.Annotation(
            new mapkit.Coordinate(cluster.lat, cluster.lng),
            (_coord: any, options: any) => {
                const container = document.createElement('div');
                const vnode = createVNode(EventAnnotation, {
                    event: options.data.events[0],
                    count: options.data.events.length
                });
                render(vnode, container);
                const dom = container.firstElementChild as HTMLElement;
                container.remove();
                return dom;
            },
            {
                data: { kind: 'event-cluster', events: cluster.events },
                anchorOffset: new DOMPoint(0, -20)
            }
        );
        annotations.push(annotation);
    });

    if (annotations.length > 0) {
        map.addAnnotations(annotations);
        currentAnnotations = annotations;
    }
}

// ── Selection ────────────────────────────────────────────────────────────────

function handleAnnotationSelection(event: any) {
    const data = event.annotation?.data;
    if (!data) return;

    if (data.kind === 'venue') {
        emit('select-venue', data.venue);
    } else if (data.kind === 'event-cluster') {
        if (data.events.length === 1) {
            emit('select-event', data.events[0]);
        } else {
            emit('select-event-cluster', data.events);
        }
    }
}

// ── Public API ───────────────────────────────────────────────────────────────

/** Imperatively re-center the map. Used when the user picks an event/venue from the list. */
function recenterOn(lat: number, lng: number, span: number = 0.05) {
    if (!map) return;
    const center = new mapkit.Coordinate(lat, lng);
    const spanCoord = new mapkit.CoordinateSpan(span, span);
    map.setRegionAnimated(new mapkit.CoordinateRegion(center, spanCoord));
}

defineExpose({ recenterOn });
</script>

<style scoped>
.events-map {
    width: 100%;
    height: 100%;
}
</style>
