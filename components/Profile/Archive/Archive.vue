<!--
    Archive.vue

    Inline archive of the user's past events, ported from the iOS `ArchiveView`.

    Behavior (mirrors iOS):
      - On first appearance the archive is "generated" by fetching the user's past
        events and is then cached to localStorage. Subsequent visits load straight
        from the cache (no network).
      - The full fetched set is cached, so switching between the 1 / 3 / 6 month
        ranges just re-filters in memory and never triggers another fetch — the user
        can force a refresh from the range menu.
      - The selected range is persisted (localStorage key `archive_range`).
-->
<template>
    <section id="archive">
        <!-- Header: optional title on the left, range/refresh menu on the right.
             The range menu doubles as the date-range label, exactly like iOS. -->
        <div class="header">
            <h2 v-if="showTitle" class="title">Archive</h2>

            <div ref="menuRoot" class="range-menu">
                <button class="range-trigger" @click="menuOpen = !menuOpen">
                    <span>{{ rangeHeader }}</span>
                    <span class="chevron" :class="{ open: menuOpen }">▾</span>
                </button>

                <div v-if="menuOpen" class="menu-popover">
                    <button
                        v-for="option in RANGES"
                        :key="option.months"
                        class="menu-item"
                        :class="{ active: option.months === range }"
                        @click="selectRange(option.months)"
                    >
                        <span class="check">{{ option.months === range ? '✓' : '' }}</span>
                        {{ option.label }}
                    </button>

                    <div class="menu-divider"/>

                    <button class="menu-item" @click="refresh">
                        <span class="check">↻</span>
                        Refresh
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="loading-state">
            <div class="spinner"/>
        </div>

        <!-- Empty -->
        <div v-else-if="events.length === 0" class="empty-state">
            <div class="empty-title">No events in this period</div>
            <div class="empty-subtitle">Go find some</div>
        </div>

        <!-- Content -->
        <template v-else>
            <!-- Stats row -->
            <div class="stats-row">
                <div class="stat-cell">
                    <div class="stat-value">{{ totalPlayed }}</div>
                    <div class="stat-label">PLAYED</div>
                </div>
                <div class="stat-divider"/>
                <div class="stat-cell">
                    <div class="stat-value">{{ totalSports }}</div>
                    <div class="stat-label">SPORTS</div>
                </div>
                <div class="stat-divider"/>
                <div class="stat-cell">
                    <div class="stat-value">{{ totalVenues }}</div>
                    <div class="stat-label">VENUES</div>
                </div>
                <div class="stat-divider"/>
                <div class="stat-cell">
                    <div class="stat-value">{{ totalHours }}</div>
                    <div class="stat-label">HOURS</div>
                </div>
            </div>

            <!-- Month sections -->
            <div v-for="group in monthlyGroups" :key="group.key" class="month-section">
                <div class="month-header">
                    <span class="month-title">{{ monthTitle(group.date) }}</span>
                    <span class="month-subtitle">{{ monthSubtitle(group) }}</span>
                </div>

                <ul class="month-events">
                    <SmallEventListItem
                        v-for="event in group.events"
                        :key="event.id"
                        :event="event"
                        @selected="goToEvent"
                    />
                </ul>
            </div>
        </template>
    </section>
</template>

<script setup lang="ts">
import { Event } from '~/data/models/EventModels';
import { EventService } from '~/data/services/EventService';
import { useSessionStore } from '@/stores/session-store';
import SmallEventListItem from '~/components/Events/SmallEventListItem/SmallEventListItem.vue';

const props = defineProps({
    // Hide the big "Archive" title when the component is rendered under a section
    // that already labels it (e.g. inside a profile tab).
    showTitle: { type: Boolean, default: true }
});

const session = useSessionStore();
const eventService = new EventService();
const router = useRouter();

// localStorage keys (mirror the iOS @AppStorage / CacheService keys).
const RANGE_KEY = 'archive_range';
const CACHE_KEY = 'archivedEvents';

// Selectable windows. `months` is the number of months back from today and is
// also the persisted value.
const RANGES = [
    { months: 1, label: 'Last Month' },
    { months: 3, label: 'Last 3 Months' },
    { months: 6, label: 'Last 6 Months' },
];

// The full set of fetched past events backing the archive (cached to disk).
const allEvents = ref<Event[]>([]);
const isLoading = ref(false);

// Persisted range selection (defaults to the last 3 months).
const range = ref<number>(3);

// Range dropdown open/close state.
const menuOpen = ref(false);
const menuRoot = ref<HTMLElement | null>(null);

// MARK: - Derived data

/** The start of the currently selected range. */
const rangeStart = computed<Date>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - range.value);
    return d;
});

/** Events that fall within the selected range, most recent first. */
const events = computed<Event[]>(() =>
    allEvents.value
        .filter((e) => e.startTime >= rangeStart.value)
        .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
);

/** Events grouped by calendar month, most recent month first. */
const monthlyGroups = computed(() => {
    const groups = new Map<string, { key: string, date: Date, events: Event[] }>();

    for (const event of events.value) {
        const d = event.startTime;
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (!groups.has(key)) {
            // First day of the month — used for sorting / formatting.
            groups.set(key, { key, date: new Date(d.getFullYear(), d.getMonth(), 1), events: [] });
        }
        groups.get(key)!.events.push(event);
    }

    return Array.from(groups.values())
        .map((g) => ({
            ...g,
            events: g.events.sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
        }))
        .sort((a, b) => b.date.getTime() - a.date.getTime());
});

// MARK: - Stats

const totalPlayed = computed<number>(() => events.value.length);

const totalSports = computed<number>(() =>
    new Set(events.value.flatMap((e) => e.sports.map((s) => s.toLowerCase()))).size
);

const totalVenues = computed<number>(() =>
    // Identify a venue by its id when available, otherwise fall back to its name so
    // that external (non-vetted) venues are still counted distinctly.
    new Set(
        events.value.flatMap((e) =>
            e.venues
                .map((v) => v.venueId ?? v.name)
                .filter((v): v is string => !!v)
        )
    ).size
);

const totalHours = computed<number>(() => {
    const ms = events.value.reduce(
        (sum, e) => sum + (e.stopTime.getTime() - e.startTime.getTime()),
        0
    );
    return Math.round(ms / 3_600_000);
});

/** Human readable span of the selected range, e.g. "Mar – Jun 2026". */
const rangeHeader = computed<string>(() => {
    const now = new Date();
    const start = rangeStart.value;

    const month = (d: Date) => d.toLocaleDateString(undefined, { month: 'short' });

    const startMonth = month(start);
    const endMonth = month(now);
    const endYear = now.getFullYear();

    // Only print the start year when it differs from the end year.
    if (start.getFullYear() === now.getFullYear()) {
        return `${startMonth} – ${endMonth} ${endYear}`;
    }
    return `${startMonth} ${start.getFullYear()} – ${endMonth} ${endYear}`;
});

// MARK: - Formatting helpers

/** e.g. "June 2026" */
const monthTitle = (date: Date) => getMonthAndYear(date);

/** e.g. "6 events · Soccer, Tennis" */
const monthSubtitle = (group: { events: Event[] }): string => {
    const count = group.events.length;
    const countText = count === 1 ? '1 event' : `${count} events`;

    const sports = Array.from(new Set(group.events.flatMap((e) => e.sports)))
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .sort()
        .join(', ');

    return sports ? `${countText} · ${sports}` : countText;
};

// MARK: - Interaction

const selectRange = (months: number) => {
    range.value = months;
    menuOpen.value = false;
    if (import.meta.client) {
        localStorage.setItem(RANGE_KEY, String(months));
    }
};

const refresh = () => {
    menuOpen.value = false;
    generateArchive();
};

const goToEvent = (payload: { event: Event }) => {
    // Tag the origin so the event detail's back link returns to the profile
    // archive instead of the events explorer.
    router.push(`/events/${payload.event.id}?from=archive`);
};

// Close the range dropdown when clicking outside of it.
const handleOutsideClick = (e: MouseEvent) => {
    if (menuRoot.value && !menuRoot.value.contains(e.target as Node)) {
        menuOpen.value = false;
    }
};

// MARK: - Caching (mirrors the iOS CacheService archive methods)

const cacheArchivedEvents = (items: Event[]) => {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(items.map((e) => e.encode())));
    } catch (error) {
        console.error('Failed to cache archived events:', error);
    }
};

const readCachedArchivedEvents = (): Event[] | null => {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const arr = JSON.parse(raw) as Array<{ [key: string]: any }>;
        return arr.map((e) => Event.decode(e));
    } catch (error) {
        console.error('Failed to read cached archived events:', error);
        return null;
    }
};

// MARK: - Data loading

/**
 * Loads the archive, preferring the on-disk (localStorage) cache and only
 * generating (fetching) when nothing has been cached yet.
 */
const loadArchive = async () => {
    if (allEvents.value.length > 0) return;

    const cached = readCachedArchivedEvents();
    if (cached && cached.length > 0) {
        allEvents.value = cached;
    } else {
        await generateArchive();
    }
};

/** Generates the archive by fetching the user's past events and caching the result. */
const generateArchive = async () => {
    const userId = session.user?.userId;
    if (!userId) return;

    isLoading.value = true;
    try {
        const pastEvents = await eventService.getUserPastEvents(userId);
        allEvents.value = pastEvents;
        session.pastEvents = pastEvents; // keep the shared session copy in sync
        cacheArchivedEvents(pastEvents);
    } catch (error) {
        console.error('Failed to generate archive:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    // Restore the persisted range selection.
    const stored = Number(localStorage.getItem(RANGE_KEY));
    if (RANGES.some((r) => r.months === stored)) {
        range.value = stored;
    }

    window.addEventListener('click', handleOutsideClick);
    loadArchive();
});

onUnmounted(() => {
    window.removeEventListener('click', handleOutsideClick);
});
</script>

<style scoped>
#archive {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
}

.header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
}

.title {
    margin: 0;
    font-size: 1.6rem;
    font-weight: bold;
    color: var(--primary-label-color);
}

/* Range / refresh dropdown */
.range-menu {
    position: relative;
    margin-left: auto;
}

.range-trigger {
    display: flex;
    gap: 0.35rem;
    cursor: pointer;
    align-items: center;
    padding: 0.3rem 0.5rem;
    border: unset;
    border-radius: 8px;
    background: transparent;
    font-size: 0.9rem;
    color: var(--secondary-label-color);

    &:hover {
        background: var(--secondary-background-color);
    }

    .chevron {
        font-size: 0.7rem;
        transition: transform 0.2s;
        &.open { transform: rotate(180deg); }
    }
}

.menu-popover {
    position: absolute;
    top: calc(100% + 0.25rem);
    right: 0;
    z-index: 10;
    min-width: 12rem;
    display: flex;
    flex-direction: column;
    padding: 0.25rem;
    border-radius: 12px;
    border: var(--component-border) solid 1px;
    background: var(--primary-background-color);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    text-align: left;
    padding: 0.5rem 0.6rem;
    border: unset;
    border-radius: 8px;
    background: transparent;
    font-size: 0.9rem;
    color: var(--primary-label-color);

    &:hover { background: var(--secondary-background-color); }
    &.active { font-weight: 600; }

    .check {
        width: 1rem;
        color: var(--primary-brand-color);
    }
}

.menu-divider {
    height: 1px;
    margin: 0.25rem 0;
    background: var(--component-border);
}

/* Stats */
.stats-row {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
}

.stat-cell {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}

.stat-value {
    font-size: 1.4rem;
    font-weight: bold;
    color: var(--primary-label-color);
}

.stat-label {
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--secondary-label-color);
}

.stat-divider {
    width: 1px;
    height: 30px;
    background: var(--component-border);
}

/* Month sections */
.month-section {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.month-header {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    padding-top: 0.5rem;
}

.month-title {
    font-size: 1.05rem;
    font-weight: bold;
    color: var(--primary-label-color);
}

.month-subtitle {
    font-size: 0.8rem;
    color: var(--secondary-label-color);
}

.month-events {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 0;
    margin: 0;
}

/* Loading / empty */
.loading-state {
    display: flex;
    justify-content: center;
    padding: 2.5rem 0;
}

.spinner {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 3px solid var(--component-border);
    border-top-color: var(--primary-brand-color);
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 2.5rem 0;
    text-align: center;
}

.empty-title {
    color: var(--primary-label-color);
}

.empty-subtitle {
    font-size: 0.85rem;
    font-weight: bold;
    color: var(--secondary-label-color);
}
</style>
