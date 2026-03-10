<template>
    <div id="competition-formats">
        <div 
            v-if="selectedSport"
            v-for="format in Object.values(selectedSport.applicableFormats)" 
            :key="format"
            :class="{ format: true, selected: selectedFormats?.includes(format) }"
            @click="handleTap(format)"
        >
            {{ format.replaceAll('_', ' ') }}
        </div>
        <div v-else class="banner">
            <div class="title">Please select a sport</div>
            <div class="sub-title">To see related competition formats</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { COMPETITION_FORMAT } from '~/data/Enums';
import { Sport } from '~/data/models/GenericModels';

const selectedSport = defineModel<Sport | undefined>('selectedSport', { required: true });
const selectedFormats = defineModel<COMPETITION_FORMAT[]>('selectedFormats', { required: true});

function handleTap(format: COMPETITION_FORMAT) {
    const idx = selectedFormats.value?.findIndex((f) => f == format);
    if (idx == -1) { 
        selectedFormats.value?.push(format);
        return
    }

    selectedFormats.value?.splice(idx, 1);
}
</script>

<style scoped>
#competition-formats {
    display: flex;
    flex-wrap: wrap;
    margin-top: 0.5rem;

    .format {
        color: black;
        cursor: pointer;
        width: fit-content;
        font-size: 0.75rem;
        border-radius: 0.75rem;
        margin: 0.25rem 0.35rem;
        padding: 0.25rem 0.75rem;
        text-transform: capitalize;
        border: 1.5px solid var(--component-border);
        background-color: var(--olympsis-light-gray);
    }

    .selected {
        border: 1.5px solid var(--secondary-brand-color);
    }

    .banner {
        padding: 1rem;
        border-radius: 1rem;
        border: 1px solid var(--component-border);
        background-color: var(--olympsis-light-gray);

        .title {
            font-size: 0.95rem;
            font-weight: 500;
            margin-bottom: 0.15rem;
            color: black;
        }

        .sub-title {
            font-size: 0.85rem;
            color: var(--olympsis-gray);
        }
    }
}
</style>