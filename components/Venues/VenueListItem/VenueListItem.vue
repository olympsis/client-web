<template>
    <li id="venue-list-item" @click="$emit('selected', { venue: venue })">
        <!-- Venue Image with floating tags top-left (matches EventListItem) -->
        <div id="header">
            <img class="image" :src="image">
            <LabelsList :tags="tags" :limit="4"/>
        </div>

        <!-- Bottom Bar (Venue Details) -->
        <div id="details" class="glass">
            <div id="title">{{ name }}</div>

            <!-- Location row: pin + locality/address -->
            <div id="location">
                <picture :style="{ height: '1rem', width: '1rem', marginRight: '0.25rem' }">
                    <source srcset="@/assets/icons/pin-drop/pin.drop.white.svg" media="(prefers-color-scheme: dark)">
                    <img class="location-pin" src="@/assets/icons/pin-drop/pin.drop.svg">
                </picture>
                <div id="location-name">{{ locationLine }}</div>
            </div>

            <!-- Bottom row: amenity icons left, transit badges right -->
            <div id="detail-row">
                <div id="detail-left">
                    <!-- Court count: tennis-court icon + units.length. Hidden when there are no units. -->
                    <div v-if="unitCount > 0" class="amenity court" :title="t('venue.unitsCount', { count: unitCount })">
                        <span class="icon icon-court"/>
                        <span class="amenity-text">{{ unitCount }}</span>
                    </div>
                    <!-- Money: any unit has a paid rate. -->
                    <span
                        v-if="hasRates"
                        class="icon icon-money"
                        :title="t('venue.paid')"
                    />
                    <!-- Membership required: access.requiresMembership. -->
                    <span
                        v-if="requiresMembership"
                        class="icon icon-membership"
                        :title="t('venue.membershipRequired')"
                    />
                </div>

                <div id="detail-right">
                    <!-- NYC-style transit badges. We only render lines that have
                         a single-character name (e.g. NYC subway "Q", "1") so they
                         visually fit a circular pill. Other transit lines could
                         get a different layout in the future; for now they're
                         filtered out so we don't render "Crosstown M5" in a tiny circle. -->
                    <span
                        v-for="line in transitBadges"
                        :key="line.id ?? line.name"
                        class="transit-badge"
                        :style="{ backgroundColor: line.color || '#888' }"
                        :title="line.system ? `${line.system} ${line.name}` : line.name"
                    >{{ line.name }}</span>
                </div>
            </div>
        </div>
    </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Venue } from '@/data/models/VenueModels';
import { generateImageURL } from '~/utils/image-helpers';

import LabelsList from '@/components/LabelsList/LabelsList.vue';

const { t } = useI18n();
const props = defineProps({
    venue: { type: Venue, required: true }
});
defineEmits(['selected']);

const name = computed(() => props.venue.name);

// Server replaced the old city/state/country trio with locality /
// administrative_area / country_code. Address (street) is preferred when
// present so the card reads more like an EventListItem location line; we
// fall back to locality + admin area otherwise.
const locationLine = computed(() => {
    if (props.venue.address) return props.venue.address;
    return [props.venue.locality, props.venue.administrativeArea].filter(Boolean).join(', ');
});

const image = computed(() => {
    const media = props.venue.media;
    if (media && media.length > 0) {
        return generateImageURL(media[0]);
    }
    return undefined;
});

/**
 * Tags floated over the venue image — sports first, then a small set of
 * descriptive flags derived from the venue's features/access blocks. Same
 * visual language as EventListItem so the two card types feel like siblings.
 */
const tags = computed<string[]>(() => {
    const labels: string[] = [];
    // Sports come first so the most discoverable info shows up.
    labels.push(...(props.venue.sports ?? []));
    // Indoor/Outdoor is binary — always render one of them.
    labels.push(props.venue.features?.indoor ? t('venue.tags.indoor') : t('venue.tags.outdoor'));
    if (props.venue.access?.requiresPermit) labels.push(t('venue.tags.permit'));
    if (props.venue.access?.requiresBooking) labels.push(t('venue.tags.booking'));
    if (props.venue.access?.requiresMembership) labels.push(t('venue.tags.membershipRequired'));
    if (props.venue.features?.illuminated) labels.push(t('venue.tags.lights'));
    return labels;
});

const unitCount = computed(() => props.venue.units?.length ?? 0);

// Treat "has rates" as "any unit has at least one rate entry" — the rate may
// vary by day/time but the presence indicates this venue charges to play.
const hasRates = computed(() => {
    return (props.venue.units ?? []).some((u) => (u.rates?.length ?? 0) > 0);
});

const requiresMembership = computed(() => !!props.venue.access?.requiresMembership);

/**
 * Transit lines we can render as a single-character colored pill. NYC subway
 * lines use 1-character names ("Q", "1", "A") which fit nicely as a small
 * circular badge with the line's color. Anything longer (e.g. bus route
 * "M5") is filtered out — it doesn't match the visual treatment.
 */
const transitBadges = computed(() => {
    return (props.venue.transitLines ?? []).filter((line) => {
        const name = line.name?.trim() ?? '';
        return name.length === 1;
    });
});
</script>

<style scoped>
#venue-list-item {
    cursor: pointer;
    min-width: 20rem;
    max-width: 23rem;
    position: relative;
    border-radius: 10px;
    list-style-type: none;
    overflow: hidden;
    border: 1px solid var(--component-border-color);

    #header {
        #labels-list {
            top: 1rem;
            left: 1rem;
            width: 90%;
            position: absolute;
            padding-bottom: 0.5rem;
        }

        .image {
            width: 100%;
            height: 28rem;
            object-fit: cover;
            border-radius: 10px;
        }
    }

    #details {
        /* Glass-overlay bottom strip — same treatment as EventListItem. */
        bottom: 0;
        left: 0;
        right: 0;
        position: absolute;
        border-radius: 0 0 10px 10px;
        border-top: 1px solid var(--component-border-color);
        padding: 0.5rem 1rem 0.75rem 1rem;

        #title {
            font-family: 'Archivo', 'Helvetica Nue', 'Roboto';
            font-weight: 600;
            font-size: 1.1rem;
            margin-bottom: 0.25rem;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            color: var(--primary-label-color);
        }

        #location {
            display: flex;
            max-height: 24px;
            font-size: 0.95rem;
            align-items: center;
            margin-bottom: 0.5rem;

            #location-name {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                color: var(--secondary-label-color);
            }

            .location-pin {
                width: 1rem;
                height: 1rem;
            }
        }

        #detail-row {
            gap: 1rem;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }

        #detail-left {
            display: flex;
            min-width: 0;
            gap: 0.6rem;
            align-items: center;
            flex-wrap: wrap;
        }

        #detail-right {
            display: flex;
            gap: 0.35rem;
            align-items: center;
            flex-shrink: 0;
        }
    }
}

/*
   Mask-based icon recoloring. Using `mask-image` lets us swap colors per
   icon without shipping multiple SVG variants (the source SVGs ship with a
   single fill, which we'd otherwise have to override at runtime).
*/
.icon {
    flex-shrink: 0;
    width: 1.1rem;
    height: 1.1rem;
    display: inline-block;
    -webkit-mask-position: center;
    mask-position: center;
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
}

.icon-court {
    -webkit-mask-image: url('@/assets/icons/tennis-court/tennis-court.svg');
    mask-image: url('@/assets/icons/tennis-court/tennis-court.svg');
    background-color: #b85b3a; /* warm court-brown to match the design mock */
}

.icon-money {
    -webkit-mask-image: url('@/assets/icons/money/money.svg');
    mask-image: url('@/assets/icons/money/money.svg');
    background-color: #2e7d4f; /* green = paid / has rates */
}

.icon-membership {
    -webkit-mask-image: url('@/assets/icons/membership/membership.svg');
    mask-image: url('@/assets/icons/membership/membership.svg');
    background-color: #c0392b; /* red = members only */
}

.amenity {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.95rem;
    color: var(--secondary-label-color);
}

.amenity-text {
    line-height: 1;
}

/*
   Single-letter NYC-style transit badge. The line color comes from the model
   and is bound inline; here we just guarantee it renders as a circular pill
   with crisp white text regardless of the underlying color.
*/
.transit-badge {
    width: 1.6rem;
    height: 1.6rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: white;
    font-weight: 700;
    font-size: 0.9rem;
    font-family: 'Archivo', 'Helvetica Nue', 'Roboto', sans-serif;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}
</style>
