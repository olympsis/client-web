<template>
    <div id="event-formats">
        <h2>Formats</h2>    
        <div id="formats">
            <div v-for="format in formats" class="format">
                {{ format.replaceAll('_', ' ') }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { COMPETITION_FORMAT } from '~/data/Enums';

defineProps({
    formats: { type: Array<COMPETITION_FORMAT> }
});
</script>

<style scoped>
#event-formats {
    grid-area: formats;

    #formats {
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
    }
}
</style>