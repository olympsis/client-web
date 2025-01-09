<template>
    <div id="new-event-card">
        <div id="header">
            <button @click="$emit('close')">
                Cancel
            </button>

            <h1> New Event </h1>

            <div :style="{ 'width': '4rem' }"/>
        </div>

        <div id="card-scroll">
            <!-- Config -->
            <div id="event-type-config">
                <EventTypePicker v-model:model-value="eventType"/>
                <div class="spacer"/>
                <EventVisibilityPicker v-model:model-value="eventVisibility"/>
                <div class="spacer"/>
                <EventSkillLevelPicker v-model:model-value="eventSkillLevel"/>
            </div>

            <div id="note">
                *fields required.
            </div>

            <!-- Sports Picker -->
            <div id="event-sports-picker">
                <MultiSportsPicker v-model:model-value="eventSports"/>
            </div>

            <!-- Organizers Picker -->
            <div id="event-organizers-picker" class="event-section">
                <div :class="{ 
                    label: newEventError !== NEW_EVENT_ERROR.NO_ORGANIZERS, 
                    error: newEventError === NEW_EVENT_ERROR.NO_ORGANIZERS 
                }"> Organizer(s) <div class="asterisk">*</div> </div>
                <div class="sub-label"> The clubs/organizations affiliated with this event. </div>
                <EventOrganizersPicker v-model:model-value="eventGroups"/>
            </div>

            <!-- Title -->
            <div id="event-title" class="event-section">
                <div :class="{ 
                    label: newEventError !== NEW_EVENT_ERROR.NO_TITLE, 
                    error: newEventError === NEW_EVENT_ERROR.NO_TITLE 
                }"> Title <div class="asterisk">*</div> </div>
                <div class="sub-label"> What to call the event? </div>
                <input type="text" v-model="eventTitle" class="text-input"/>
            </div>

            <!-- Description -->
            <div id="event-description" :class="{ 'event-section': true, required: newEventError === NEW_EVENT_ERROR.NO_DESCRIPTION }">
                <div :class="{ 
                    label: newEventError !== NEW_EVENT_ERROR.NO_DESCRIPTION, 
                    error: newEventError === NEW_EVENT_ERROR.NO_DESCRIPTION 
                }"> Description <div class="asterisk">*</div> </div>
                <div class="sub-label"> Give details about the event </div>
                <textarea type="text" v-model="eventDescription" class="text-large"/>
            </div>

            <!-- Venues Picker -->
            <div id="event-venue-picker" :class="{ 'event-section': true, required: newEventError === NEW_EVENT_ERROR.NO_VENUES }">
                <div :class="{ 
                    label: newEventError !== NEW_EVENT_ERROR.NO_VENUES, 
                    error: newEventError === NEW_EVENT_ERROR.NO_VENUES 
                }"> Venue(s) <div class="asterisk">*</div> </div>
                <div class="sub-label"> The location for this event </div>
                <EventVenuesPicker v-model:model-value="eventVenues"/>
            </div>

            <!-- Start Date -->
            <div id="event-start-date-picker" :class="{ 'event-section': true, required: newEventError === NEW_EVENT_ERROR.INVALID_START_DATE }">
                <div class="label"> Start Date/Time <div class="asterisk">*</div> </div>
                <div class="sub-label"> When does this event start? </div>
                <Calendar 
                    v-model="eventStartDate" 
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
                                'background-color': 'var(--tertiary-background-color)'
                            }
                        }),
                        input: () => ({
                            style: {
                                'width': '100%',
                                'border': 'unset',
                                'outline': 'unset',
                                'color': 'var(--primary-label-color)',
                                'background-color': 'var(--tertiary-background-color)'
                            }
                        }),
                    }"
                />
            </div>

            <!-- End Date -->
            <div id="event-end-date-picker" :class="{ 'event-section': true, required: newEventError === NEW_EVENT_ERROR.INVALID_END_DATE }">
                <div class="label"> End Date/Time </div>
                <div class="sub-label"> When does this event end? (Optional) </div>
                <Calendar 
                    v-model="eventEndDate" 
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
                                'background-color': 'var(--tertiary-background-color)'
                            }
                        }),
                        input: () => ({
                            style: {
                                'border': 'unset',
                                'outline': 'unset',
                                'color': 'var(--primary-label-color)',
                                'background-color': 'var(--tertiary-background-color)'
                            }
                        }),
                    }"
                />
            </div>

            <!-- Image Picker -->
            <div id="event-image-picker">
                <EventImagePicker v-model:selected-sport="eventSport" v-model:selected-image="eventImage" />
            </div>

            <!-- Primary Action -->
            <div id="action-wrapper">
                <BoldTextButton v-model="state" text="create" @click="createNewEvent"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import type { Ref } from 'vue';
import { computed, ref } from 'vue';
import { SPORTS, VIEW_STATE } from '~/data/Enums';
import { useSessionStore } from '@/stores/session-store';
import { GroupSelection, VenueDescriptor } from '~/data/models/GenericModels';
import { EVENT_SKILL_LEVEL, EVENT_TYPE, EVENT_VISIBILITY } from '~/data/Enums';
import { NEW_EVENT_ERROR, NewEventManager } from '~/data/managers/NewEventManager';

import Calendar from 'primevue/calendar';
import EventTypePicker from '../EventTypePicker/EventTypePicker.vue';
import EventImagePicker from '../EventImagePicker/EventImagePicker.vue';
import EventVenuesPicker from '../EventVenuesPicker/EventVenuesPicker.vue';
import MultiSportsPicker from '../../../MultiSportsPicker/MultiSportsPicker.vue';
import EventVisibilityPicker from '../EventVisibilityPicker/EventVisibilityPicker.vue';
import EventSkillLevelPicker from '../EventSkillLevelPicker/EventSkillLevelPicker.vue';
import EventOrganizersPicker from '../EventOrganizersPicker/EventOrganizersPicker.vue';
import BoldTextButton from '~/components/Buttons/LoadingButtons/BoldTextButton/BoldTextButton.vue';

const session = useSessionStore();

const emit = defineEmits(['close']);
const state: Ref<VIEW_STATE> = ref(VIEW_STATE.PENDING);
const manager: NewEventManager = new NewEventManager();
const newEventError: Ref<NEW_EVENT_ERROR | null> = ref(null);

const eventSport = computed<SPORTS>(() => {
    return eventSports.value[0] ?? SPORTS.RUNNING;
});
const eventSports: Ref<Array<SPORTS>> = ref([SPORTS.RUNNING]);

const eventVenues: Ref<VenueDescriptor[]> = ref([]);
const eventType: Ref<EVENT_TYPE> = ref(EVENT_TYPE.REGULAR);
const eventVisibility: Ref<EVENT_VISIBILITY> = ref(EVENT_VISIBILITY.PUBLIC);
const eventSkillLevel: Ref<EVENT_SKILL_LEVEL> = ref(EVENT_SKILL_LEVEL.ANY_LEVEL);

const eventTitle: Ref<string> = ref('');
const eventImage: Ref<string> = ref('');

const eventDescription: Ref<string> = ref('');
const eventGroups: Ref<GroupSelection[]> = ref([]);

const eventStartDate: Ref<Date> = ref(new Date());
const eventEndDate: Ref<Date | undefined> = ref(undefined);
 

function createNewEvent() {
    state.value = VIEW_STATE.LOADING;

    const isInvalid = manager.validateNewEventData(
        eventTitle.value,
        eventDescription.value,
        eventGroups.value,
        eventVenues.value,
        eventImage.value
    );
    
    if (isInvalid != null) {
        newEventError.value = isInvalid;
        state.value = VIEW_STATE.PENDING;
    } else {
        newEventError.value = null;
        const data = manager.generateNewEventData(
            eventType.value,
            eventVisibility.value,
            eventSkillLevel.value,
            eventGroups.value,
            [eventSport.value], // TODO: SUPPORT MULTI-SPORTS EVENTS HERE
            eventTitle.value,
            eventDescription.value,
            eventVenues.value,
            eventStartDate.value,
            eventEndDate.value,
            eventImage.value,
            0,
            0
        );

        if (data) {
            manager.createNewEvent(data)
                .then((id: string | null) => {
                    if (id) {
                        state.value = VIEW_STATE.SUCCESS;
                        let _event = manager.generateNewEventModel(id, data);
                        session.events.push(_event);
                        emit('close');
                    } else {
                        throw('No ID returned by the server.')
                    }
                })
                .catch((error: any) => {
                    state.value = VIEW_STATE.FAILURE;
                    console.error('Failed to create event. Error: ', error);
                    setTimeout(() => {
                        state.value = VIEW_STATE.PENDING;
                    }, 250);
                });
        }
    }
}
</script>

<style scoped>
#new-event-card {
    width: 100%;
    max-width: 35rem;
    border-radius: 15px;
    background-color: var(--primary-background-color);

    #header {
        display: flex;
        padding: 1rem;
        justify-content: space-between;

        button {
            all: unset;
            cursor: pointer;
            font-size: 0.9rem;
            color: var(--primary-label-color);
        }

        h1 {
            font-size: 1rem;
            font-style: italic;
            text-transform: uppercase;
            color: var(--primary-label-color);
        }
    }

    #event-type-config {
        display: flex;
        margin: 1rem;
        
        .spacer {
            margin: 0rem 0.5rem;
        }
    }

    #note {
        font-size: 0.9rem;
        margin: 0.2rem 1rem;
        color: var(--tertiary-brand-color);
    }

    #event-organizers-picker {
        margin: 1rem;

        .label {
            display: flex;
            color: var(--primary-label-color);
            
        }

        .sub-label {
            color: gray;
            font-size: 0.8rem;
            margin-bottom: 0.4rem;
        }
    }

    .event-section {
        margin: 1rem;

        .label {
            display: flex;
            color: var(--primary-label-color);
        }

        .sub-label {
            color: gray;
            font-size: 0.8rem;
            margin-bottom: 0.4rem;
        }

        .text-input {
            width: 100%;
            height: 2.5rem;
            border: unset;
            font-size: 1.3rem;
            padding: 0rem 0.5rem;
            border-radius: 10px;
            color: var(--primary-label-color);
            background-color: var(--tertiary-background-color);
        }

        .text-large {
            width: 100%;
            height: 6rem;
            border: unset;
            padding: 0.5rem;
            font-size: 1.3rem;
            border-radius: 10px;
            color: var(--primary-label-color);
            background-color: var(--tertiary-background-color);
        }
    }

    .error {
        color: red;
        display: flex;
        font-weight: bold;
    }

    .asterisk {
        color: var(--tertiary-brand-color);
    }

    #card-scroll {
        height: 80vh;
        overflow-y: scroll;
    }

    #action-wrapper {
        margin: 2.5rem 2rem;
    }
}
</style>