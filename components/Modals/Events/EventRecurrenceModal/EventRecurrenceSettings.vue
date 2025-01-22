<template>
    <div id="event-recurrence-settings" class="popup">
        <div class="header">
            <button class="secondary button" @click="$emit('close')">
                Cancel
            </button>

            <div class="title">
                Recurring Event
            </div>

            <button class="primary button" @click="$emit('done', { frequency, endDate })">
                Done
            </button>
        </div>

        <div id="body" class="body">
            <div class="section">
                <div class="header">
                    Recurrence Frequency
                </div>
                <div class="sub-header">
                    How often do you want this event to happen?
                </div>

                <div class="actions">
                    <button 
                        @click="frequency = EVENT_RECURRENCE_FREQUENCY.WEEKLY"
                        :class="{selected: frequency === EVENT_RECURRENCE_FREQUENCY.WEEKLY}"
                    >
                        WEEKLY
                    </button>
                    <button 
                        @click="frequency = EVENT_RECURRENCE_FREQUENCY.MONTHLY"
                        :class="{selected: frequency === EVENT_RECURRENCE_FREQUENCY.MONTHLY}"
                    >
                        MONTHLY
                    </button>
                </div>
            </div>

            <div class="section">
                <div class="header">
                    End Date
                </div>
                <div class="sub-header">
                    When do you want this recurrence to stop?
                </div>

                <DatePicker 
                    class="date-picker"
                    v-model="endDate" 
                    showTime hourFormat="12" 
                    :pt="{
                         root: (options) => ({
                            style: {
                                'display': 'flex'
                            }
                        }),
                        panel: (options) => ({
                            style: {
                                'color': 'var(--primary-label-color)',
                                'background-color': 'var(--secondary-background-color)'
                            }
                        }),
                        input: () => ({
                            style: {
                                'width': '100%',
                                'border': 'unset',
                                'outline': 'unset',
                                'color': 'var(--primary-label-color)',
                                'background-color': 'var(--secondary-background-color)'
                            }
                        }),
                    }"
                    :style="{
                        marginTop: '0.5rem'
                    }"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import DatePicker from 'primevue/datepicker';
import { EVENT_RECURRENCE_FREQUENCY } from '~/data/Enums';

const emit = defineEmits(['close', 'done']);
const frequency = ref<EVENT_RECURRENCE_FREQUENCY>(EVENT_RECURRENCE_FREQUENCY.WEEKLY);
const endDate = ref<Date>(new Date());
</script>

<style scoped>
#event-recurrence-settings {
    width: 100%;
    padding: 1rem;
    background-color: var(--primary-background-color);
}

#body {
    flex-direction: column;
}

.actions {
    button {
        border: unset;
        margin: 0.5rem;
        cursor: pointer;
        border-radius: 10px;
        padding: 0.5rem 1rem;
        background-color: var(--secondary-background-color);

        &.selected {
            border: 3px solid var(--primary-brand-color) !important;
        }
    }
}
</style>