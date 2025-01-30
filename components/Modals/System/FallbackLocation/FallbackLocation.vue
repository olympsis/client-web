<template>
    <div id="fallback-location" class="modal">
        <div class="header">
            <h1 class="title">Setting a fallback Location</h1>
            <h2 class="sub-title">If we can’t access your location, a designated fallback would ensure that we deliver relevant results.</h2>
        </div>

        <div class="body">
            <LocalePicker :show-cancel="false" :show-cities="true" @completed="handleLocaleCompletion"/>
        </div>

        <div class="actions">
            <button class="secondary button" @click="$emit('cancel')">
                Cancel
            </button>

            <button class="primary button" @click="$emit('done')" :disabled="!isCompleted">
                Done
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import LocalePicker from '~/components/LocalePicker/LocalePicker.vue';

const emit = defineEmits(['cancel','done']);
const isCompleted = ref<boolean>(false);

function handleLocaleCompletion(event: { country: string, state: string, city: string, coordinates: number[] }) {
    isCompleted.value = true;
    emit('done', { 
        country: event.country,
        city: event.city,
        state: event.state,
        coordinates: event.coordinates
    });
}
</script>

<style scoped>
#fallback-location {
    max-width: 32rem;

    .header {
        flex-direction: column;

        .title {
            text-align: center;
        }

        .sub-title {
            font-size: 1rem;
            font-style: normal;
            text-align: center;
            font-weight: normal;
            margin: 0.5rem 0rem;
            color: var(--primary-label-color);
        }
    }

    .body {
        margin-top: 0.5rem;
        margin-bottom: 1rem;
        align-items: center;
        justify-content: center;
    }

    .actions {
        .secondary {
            margin-right: 0.5rem;
        }

        .primary {
            margin-left: 0.5rem;

            &:enabled {
                background-color: var(--primary-brand-color);
            }
        }
    }
}
</style>