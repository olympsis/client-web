<template>
    <div id="event-advanced-settings">
        <div id="participants" class="section">
            <h3 class="header">
                Participants
                <div :style="{ marginRight: '1rem', cursor: 'pointer' }" @click="showParticipantOptions = !showParticipantOptions">
                    <picture class="centered">
                        <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/chevron/chevron.left.svg" class="chevron" :class="{ open: showParticipantOptions == true }"/>
                    </picture>
                </div>
            </h3>

            <div class="sub-header" v-if="!showParticipantOptions">
                Set event capacity & more
            </div>

            <div class="sub-section" v-if="showParticipantOptions">
                <div class="sub-section-header">Min Participants</div>
                <div class="sub-section-sub-header">Least amount of participants needed for event.</div>

                <div id="input" class="participants-slider">
                    <input type="number" v-model="min"/>
                </div>
            </div>

            <div class="sub-section" v-if="showParticipantOptions">
                <div class="sub-section-header">Max Participants</div>
                <div class="sub-section-sub-header">Set the event's capacity.</div>

                <div id="input" class="participants-slider">
                    <input type="number" v-model="max"/>
                </div>
            </div>

            <div class="sub-section" v-if="showParticipantOptions">
                <div class="sub-section-header">
                    Add a Waitlist
                </div>
                <div class="sub-section-sub-header">
                    Allow extra participants to join if spots open up.
                </div>

                <div id="input" :style="{ marginTop: '0.5rem', marginLeft: 'auto' }">
                    <ToggleSwitch v-model="hasWaitlist"/>
                </div>
            </div>
        </div>

        <div id="recurrence" class="section">
            <h3 class="header">
                Recurring event
                <div :style="{ marginRight: '1rem', cursor: 'pointer' }" @click="showRecurrenceOptions = !showRecurrenceOptions">
                    <picture class="centered">
                        <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/chevron/chevron.left.svg" class="chevron" :class="{ open: showRecurrenceOptions == true }"/>
                    </picture>
                </div>
            </h3>

            <div class="sub-header" v-if="!showRecurrenceOptions">
                Set this event to repeat
            </div>

            <div class="sub-section" v-if="showRecurrenceOptions">
                <div class="sub-section-header">
                    Recurrence Frequency
                </div>
                <div class="sub-section-sub-header">
                    How often do you want this event to happen?
                </div>

                <div :style="{ display: 'flex', fontSize: '0.8rem', alignItems: 'center', marginLeft: '1rem', fontWeight: 'bold', lineHeight: '0.5rem', marginTop: '1rem' }">
                    Every
                    <input type="number" :style="{ width: '4rem', marginLeft: '0.5rem', marginTop: 'unset' }" class="input" v-model="recurrenceInterval"/>
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

            <div class="sub-section" v-if="showRecurrenceOptions">
                <div class="sub-section-header">
                    End Date
                </div>
                <div class="sub-section-sub-header">
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

        <div id="externalLink" class="section">
            <h3 class="header">
                External Link
                <div :style="{ marginRight: '1rem', cursor: 'pointer' }" @click="showExternalLinkOption = !showExternalLinkOption">
                    <picture class="centered">
                        <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/chevron/chevron.left.svg" class="chevron" :class="{ open: showExternalLinkOption == true }"/>
                    </picture>
                </div>
            </h3>
            <div class="sub-header">Redirect participants to URL after RSVP'ing</div>

            <input class="input" v-model="eventExternalLink" v-if="showExternalLinkOption"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import DatePicker from 'primevue/datepicker';
import ToggleSwitch from 'primevue/toggleswitch';

import { EVENT_RECURRENCE_FREQUENCY } from '~/data/Enums';
import { RecurrenceOptions, ParticipantsConfig } from '~/data/models/EventModels';

const participantsConfig = defineModel<ParticipantsConfig | undefined>('participantsConfig', { required: true });
const eventExternalLink = defineModel<string>('externalLink', { required: true });
const recurrenceOptions = defineModel<RecurrenceOptions | undefined>('recurrenceOptions', { required: true });

const showRecurrenceOptions = ref<boolean>(false);
const showParticipantOptions = ref<boolean>(false);
const showExternalLinkOption = ref<boolean>(false);

const min = ref<number>(0);
const max = ref<number>(0);
const endDate = ref<Date>(new Date());
const hasWaitlist = ref<boolean>(false);
const recurrenceInterval = ref<number>(1);
const frequency = ref<EVENT_RECURRENCE_FREQUENCY>(EVENT_RECURRENCE_FREQUENCY.WEEKLY);

watch(min, () => {
    if (participantsConfig.value == undefined) {
        participantsConfig.value = new ParticipantsConfig(hasWaitlist.value, min.value, max.value);
    } else {
        participantsConfig.value.minParticipants = min.value;
    }
}, { immediate: false });

watch(max, () => {
    if (participantsConfig.value == undefined) {
        participantsConfig.value = new ParticipantsConfig(hasWaitlist.value, min.value, max.value);
    } else {
        participantsConfig.value.maxParticipants = max.value;
    }
}, { immediate: false });

watch(hasWaitlist, () => {
    if (participantsConfig.value == undefined) {
        participantsConfig.value = new ParticipantsConfig(hasWaitlist.value, min.value, max.value);
    } else {
        participantsConfig.value.hasWaitlist = hasWaitlist.value;
    }
}, { immediate: false });

watch(frequency, () => {
    if (recurrenceOptions.value == undefined) {
        recurrenceOptions.value = new RecurrenceOptions(frequency.value.valueOf(), endDate.value, recurrenceInterval.value);
    } else { 
        recurrenceOptions.value.pattern = frequency.value.valueOf();
    }
}, { immediate: false });

watch(recurrenceInterval, () => {
    if (recurrenceOptions.value == undefined) {
        recurrenceOptions.value = new RecurrenceOptions(frequency.value.valueOf(), endDate.value, recurrenceInterval.value);
    } else { 
        recurrenceOptions.value.interval = recurrenceInterval.value;
    }
}, { immediate: false });

watch(endDate, () => {
    if (recurrenceOptions.value == undefined) {
        recurrenceOptions.value = new RecurrenceOptions(frequency.value.valueOf(), endDate.value, recurrenceInterval.value);
    } else { 
        recurrenceOptions.value.endTime = endDate.value;
    }
}, { immediate: false });

onMounted(() => {
    if (participantsConfig.value != undefined) {
        min.value = participantsConfig.value.minParticipants ?? 0;
        max.value = participantsConfig.value.maxParticipants ?? 0;
        hasWaitlist.value = participantsConfig.value.hasWaitlist ?? false;
        showParticipantOptions.value = true;
    }

    if (recurrenceOptions.value != undefined) {
        endDate.value = recurrenceOptions.value.endTime;
        frequency.value = recurrenceOptions.value.pattern == 'WEEKLY' ? EVENT_RECURRENCE_FREQUENCY.WEEKLY : EVENT_RECURRENCE_FREQUENCY.MONTHLY;
        recurrenceInterval.value = recurrenceOptions.value.interval;
        showRecurrenceOptions.value = true
    }

    if (eventExternalLink.value != '') {
        showExternalLinkOption.value = true;
    }
});
</script>

<style scoped>
#event-advanced-settings {
    width: 100%;
    padding: 1rem;

    #body {
        margin-top: 1rem;
        padding: 0.5rem 0rem;
        flex-direction: column;

        div {
            margin: 0.25rem 1rem;
        }
    }
}

.divider {
    height: 1px;
    color: var(--primary-label-color);
}

.section {
    display: flex;
    margin-bottom: 1.5rem;
    flex-direction: column;

    .header {
        display: flex;

        .chevron {
            width: 1rem;
            height: 1rem;
            margin-left: 0.5rem;
            transform: rotate(-90deg);
        }

        .open {
            width: 1rem;
            height: 1rem;
            margin-left: 0.5rem;
            transform: rotate(90deg);
        }
    }

    .sub-header {
        color: gray;
        font-size: 0.9rem;
    }
}

.sub-section {
    display: flex;
    margin: 0.25rem 0rem;
    flex-direction: column;

    .sub-section-header {
        font-size: 0.85rem;
    }

    .sub-section-sub-header {
        color: gray;
        font-size: 0.7rem;
    }
}

.participants-slider {
    display: flex;
    align-items: center;
    margin-left: auto;

    input {
        width: 7rem;
        height: 2rem;
        border: unset;
        font-size: 1rem;
        margin-left: 2rem;
        margin-top: 0.5rem;
        border-radius: 10px;
        padding: 0rem 0.5rem;
    }
}

.input {
    width: 100%;
    height: 2rem;
    border: unset;
    margin-top: 0.5rem;
    font-size: 1.25rem;
    border-radius: 10px;
    padding: 0rem 0.5rem;
    background-color: var(--secondary-background-color);
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