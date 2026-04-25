<template>
    <!--
        "Court Details" section for VenueDetailCard:
          - colored pill flags (surface, paid, indoor/outdoor, lights, etc.)
          - court count + a row of court icons (one per VenueUnit)
          - a season + hours grid derived from `availability`
        Lives inside the venue detail modal as a sibling card-section.
    -->
    <section v-if="venue" class="venue-court-details card-section">
        <h3>{{ $t('venue.courtDetails.title') }}</h3>

        <!-- Pills row -->
        <ul v-if="pills.length > 0" class="pills">
            <li
                v-for="pill in pills"
                :key="pill.label"
                class="pill"
                :class="`variant-${pill.variant}`"
            >{{ pill.label }}</li>
        </ul>

        <!-- Court count + a row of court icons (one per VenueUnit). Each icon
             takes its color from the corresponding unit's `surfaceColor` so a
             venue with mixed surfaces reads correctly (e.g. 2 clay + 2 hard
             courts show two warm-brown icons + two blue icons). -->
        <div v-if="unitCount > 0" class="courts">
            <div class="courts-label">
                <span class="courts-count">{{ courtCountLabel }}</span>
                <span v-if="surfaceLabel" class="courts-surface">({{ surfaceLabel }})</span>
            </div>
            <ul class="court-icons">
                <li
                    v-for="(unit, i) in venue.units"
                    :key="unit.id ?? i"
                    class="court-icon-cell"
                >
                    <span class="icon icon-court" :style="{ backgroundColor: unit.surfaceColor || undefined }"/>
                </li>
            </ul>
        </div>

        <!-- Season + Hours grid -->
        <div class="info-grid">
            <div class="info-block">
                <div class="info-header">
                    <!--
                       Mask-based icons (instead of <img>) so they always render
                       in the brand color regardless of the parent card's
                       dark-bg/light-bg luminance detection. The previous
                       <picture> approach inverted with the cover image's tone,
                       which clashed with the section's intent of "this is a
                       calendar/clock indicator", not "match the photo".
                    -->
                    <span class="icon icon-calendar"/>
                    <span class="info-title">{{ $t('venue.courtDetails.season') }}</span>
                </div>
                <div class="info-value">{{ seasonLabel }}</div>
            </div>

            <div class="info-block">
                <div class="info-header">
                    <span class="icon icon-clock"/>
                    <span class="info-title">{{ $t('venue.courtDetails.hours') }}</span>
                </div>
                <div class="info-value">{{ hoursLabel }}</div>
            </div>
        </div>

        <!-- Transit sub-section. Renders nothing when transit_lines is empty,
             so the parent card stays clean for venues without transit data. -->
        <VenueTransitDetails :venue="venue"/>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Venue } from '@/data/models/VenueModels';
import type { TimeSlot } from '@/data/models/VenueModels';

import VenueTransitDetails from '@/components/Venues/VenueTransitDetails/VenueTransitDetails.vue';

const { t } = useI18n();

const props = defineProps({
    venue: { type: Venue, required: true }
});

// ── Pills ───────────────────────────────────────────────────────────────────

type PillVariant =
    | 'surface' | 'paid' | 'indoor' | 'outdoor'
    | 'lights' | 'accessible' | 'permit' | 'no-permit'
    | 'membership' | 'booking';

interface Pill { label: string; variant: PillVariant; }

/** Dominant surface across all units — falls back to undefined if no units. */
const dominantSurface = computed<string | undefined>(() => {
    const counts: Record<string, number> = {};
    (props.venue.units ?? []).forEach((u) => {
        const s = (u.surface as string)?.trim();
        if (!s) return;
        counts[s] = (counts[s] ?? 0) + 1;
    });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return entries[0]?.[0];
});

/** "artificial_grass" → "Artificial Grass" */
function titleize(s: string): string {
    return s.split(/[\s_]+/)
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

const pills = computed<Pill[]>(() => {
    const v = props.venue;
    const out: Pill[] = [];

    if (dominantSurface.value) {
        out.push({ label: titleize(dominantSurface.value), variant: 'surface' });
    }

    const hasRates = (v.units ?? []).some((u) => (u.rates?.length ?? 0) > 0);
    if (hasRates) out.push({ label: t('venue.courtDetails.pills.paid'), variant: 'paid' });

    out.push(v.features?.indoor
        ? { label: t('venue.courtDetails.pills.indoor'), variant: 'indoor' }
        : { label: t('venue.courtDetails.pills.outdoor'), variant: 'outdoor' }
    );

    if (v.features?.illuminated) {
        out.push({ label: t('venue.courtDetails.pills.lights'), variant: 'lights' });
    }
    if (v.features?.accessible) {
        out.push({ label: t('venue.courtDetails.pills.accessible'), variant: 'accessible' });
    }

    // Permit pill — show "Permit" if required, "No Permit" otherwise (matches
    // the reference design's vocabulary; both forms reassure the reader that
    // we know one way or the other).
    out.push(v.access?.requiresPermit
        ? { label: t('venue.courtDetails.pills.permit'), variant: 'permit' }
        : { label: t('venue.courtDetails.pills.noPermit'), variant: 'no-permit' }
    );

    if (v.access?.requiresMembership) {
        out.push({ label: t('venue.courtDetails.pills.membership'), variant: 'membership' });
    }
    if (v.access?.requiresBooking) {
        out.push({ label: t('venue.courtDetails.pills.booking'), variant: 'booking' });
    }

    return out;
});

// ── Court count ─────────────────────────────────────────────────────────────

const unitCount = computed<number>(() => props.venue.units?.length ?? 0);
const courtCountLabel = computed<string>(() => t('venue.courtDetails.courtsCount', { count: unitCount.value }));
const surfaceLabel = computed<string | undefined>(() => dominantSurface.value ? titleize(dominantSurface.value) : undefined);

// ── Season ──────────────────────────────────────────────────────────────────

const seasonLabel = computed<string>(() => {
    // We only need to surface the binary state here — either the venue has
    // seasonal hour overrides (so it's "In Season" right now / scheduled by
    // window) or it doesn't, in which case the regular hours apply all year.
    // A list of season names would be noisier than useful in this slot.
    const seasons = props.venue.availability?.seasonalHours ?? [];
    return seasons.length > 0
        ? t('venue.courtDetails.inSeason')
        : t('venue.courtDetails.yearRound');
});

// ── Hours ───────────────────────────────────────────────────────────────────

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const DAY_SHORT: Record<string, string> = {
    monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
    friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
};

/** "06:30" → "6:30 AM"; "00:00" → "12 AM"; minutes are dropped when zero. */
function formatTime(hhmm: string): string {
    const parts = hhmm?.split(':') ?? [];
    const h = Number(parts[0]);
    const m = Number(parts[1] ?? 0);
    if (!Number.isFinite(h)) return hhmm ?? '';
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return m > 0 ? `${h12}:${String(m).padStart(2, '0')} ${ampm}` : `${h12} ${ampm}`;
}

/**
 * Group consecutive days with identical hours into ranges:
 *   "5:30 AM - 12 AM (Mon-Fri), 7 AM - 12 AM (Sat-Sun)"
 */
function summarizeHours(slots: TimeSlot[]): string {
    if (!slots || slots.length === 0) return t('venue.courtDetails.hoursUnavailable');

    const dayHours: Record<string, string> = {};
    slots.forEach((s) => {
        const day = s.day?.toLowerCase();
        if (!day || !s.open || !s.close) return;
        dayHours[day] = `${formatTime(s.open)} - ${formatTime(s.close)}`;
    });

    type Group = { days: string[]; hours: string };
    const groups: Group[] = [];
    DAY_ORDER.forEach((day) => {
        const hours = dayHours[day];
        if (!hours) return;
        const last = groups[groups.length - 1];
        if (last && last.hours === hours) {
            last.days.push(day);
        } else {
            groups.push({ days: [day], hours });
        }
    });

    return groups.map((g) => {
        // Each group always has at least one day (we only push into `groups`
        // while iterating DAY_ORDER), so the array accesses are safe — but
        // TS strict index access can't infer that. Default to '' to keep
        // the lookup typed without leaking `undefined` into DAY_SHORT[…].
        const startDay = g.days[0] ?? '';
        const endDay = g.days[g.days.length - 1] ?? '';
        const start = DAY_SHORT[startDay];
        const end = DAY_SHORT[endDay];
        const range = g.days.length > 1 ? `${start}-${end}` : start;
        return `${g.hours} (${range})`;
    }).join(', ');
}

const hoursLabel = computed<string>(() => summarizeHours(props.venue.availability?.regularHours ?? []));
</script>

<style scoped>
/* Card frame matches the other VenueDetailCard sections (glass + border). */
.card-section {
    margin: 0 1rem 1rem 1rem;
    padding: 1rem 1.25rem;
    border-radius: 16px;
    border: var(--component-border-color) solid 1px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.12);
    color: var(--primary-label-color);

    h3 {
        margin: 0 0 0.75rem 0;
        font-size: 1rem;
        font-weight: 700;
        color: var(--primary-label-color);
    }
}

/* ── Pills ──────────────────────────────────────────────────────────────── */
.pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    list-style: none;
    margin: 0 0 1rem 0;
    padding: 0;
}

/*
   Reuse the existing dark glass tag style already used by VenueDetailCard's
   header (and aligned with LabelsList/TabLabel elsewhere in the app). All
   variants render identically — categorization comes from the label text,
   not color, which keeps the section visually consistent with the rest of
   the modal instead of introducing a brand-new pastel palette.
*/
.pill {
    display: inline-flex;
    padding: 0.3rem 0.7rem;
    border-radius: 20px;
    font-size: 0.8rem;
    align-items: center;
    gap: 0.35rem;
    white-space: nowrap;
    color: var(--primary-label-color);
    border: 1px solid var(--component-border-color);
    background: rgba(0, 0, 0, 0.25);
}

/* ── Court count + icon row ─────────────────────────────────────────────── */
.courts {
    margin-bottom: 1rem;

    .courts-label {
        display: flex;
        gap: 0.4rem;
        margin-bottom: 0.5rem;
        align-items: baseline;
    }
    .courts-count {
        font-weight: 700;
        font-size: 1rem;
        color: var(--primary-label-color);
    }
    .courts-surface {
        color: var(--secondary-label-color);
        font-size: 0.95rem;
    }
    .court-icons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        list-style: none;
        margin: 0;
        padding: 0;
    }
    /*
       Glass-cell wrapper around each court icon — same translucent panel +
       border treatment used elsewhere in the modal. The icon itself is
       recolored to the same warm court tone as VenueListItem so the two
       components share a visual language.
    */
    .court-icon-cell {
        display: flex;
        width: 2.4rem;
        height: 2.4rem;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        border: 1px solid var(--component-border-color);
        background: rgba(0, 0, 0, 0.25);
    }
    /*
       Default court icon color is the primary label color so it matches the
       header text (white on dark cover images, black on light). The inline
       style binding on each icon overrides this with the unit's
       server-supplied `surfaceColor` when one is present.
    */
    .court-icon-cell .icon-court {
        background-color: var(--primary-label-color);
    }
}

/* ── Info grid: Season + Hours ──────────────────────────────────────────── */
.info-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
}

@media (max-width: 600px) {
    .info-grid {
        grid-template-columns: minmax(0, 1fr);
    }
}

.info-block {
    .info-header {
        display: flex;
        gap: 0.4rem;
        align-items: center;
        margin-bottom: 0.25rem;
    }
    .info-icon img { width: 1.2rem; height: 1.2rem; display: block; }
    .info-title {
        font-weight: 700;
        font-size: 1rem;
        color: var(--primary-label-color);
    }
    .info-value {
        color: var(--secondary-label-color);
        line-height: 1.4;
    }
}

/* ── Mask-based icon recolor (matches VenueListItem / VenueDetailCard) ──── */
.icon {
    flex-shrink: 0;
    width: 1.2rem;
    height: 1.2rem;
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
}

/*
   Calendar + clock indicators track the section header text color so they
   read as a unit with their respective titles ("Season" / "Hours"). On a
   dark cover image both the title text and these icons are white; on a
   light cover image both are black.
*/
.icon-calendar {
    -webkit-mask-image: url('@/assets/icons/calendar/calendar.month.svg');
    mask-image: url('@/assets/icons/calendar/calendar.month.svg');
    background-color: var(--primary-label-color);
}
.icon-clock {
    -webkit-mask-image: url('@/assets/icons/clock/clock.svg');
    mask-image: url('@/assets/icons/clock/clock.svg');
    background-color: var(--primary-label-color);
}
</style>
