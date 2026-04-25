<template>
    <!--
        Segmented Events|Venues toggle. Drives both:
          - what's pinned on the map
          - what's listed in the side/bottom panel
        Lives in the panel header on desktop and in the bottom-sheet header on mobile.
    -->
    <div class="map-list-toggle" role="tablist">
        <button
            class="segment"
            :class="{ active: modelValue === 'events' }"
            type="button"
            role="tab"
            :aria-selected="modelValue === 'events'"
            @click="select('events')"
        >
            {{ t('events.toggle.events') }}
        </button>
        <button
            class="segment"
            :class="{ active: modelValue === 'venues' }"
            type="button"
            role="tab"
            :aria-selected="modelValue === 'venues'"
            @click="select('venues')"
        >
            {{ t('events.toggle.venues') }}
        </button>
    </div>
</template>

<script setup lang="ts">
export type ExplorerMode = 'events' | 'venues';

const { t } = useI18n();

const props = defineProps<{
    modelValue: ExplorerMode;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: ExplorerMode): void;
}>();

function select(mode: ExplorerMode) {
    if (props.modelValue === mode) return;
    emit('update:modelValue', mode);
}
</script>

<style scoped>
.map-list-toggle {
    display: inline-flex;
    padding: 0.25rem;
    gap: 0.25rem;
    border-radius: 999px;
    border: var(--component-border-color) solid 1px;
    background-color: var(--secondary-background-color);
}

.segment {
    all: unset;
    cursor: pointer;
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
    font-weight: 500;
    border-radius: 999px;
    text-align: center;
    color: var(--secondary-label-color, gray);
    transition: background-color 120ms ease, color 120ms ease;
    user-select: none;

    &:hover:not(.active) {
        background-color: var(--tertiary-background-color);
    }

    &.active {
        color: white;
        background-color: var(--primary-brand-color);
    }
}
</style>
