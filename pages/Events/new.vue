<template>
    <NavigationBar/>
    <div id="new-event-view">
        <div id="left">
            <!-- Header -->
            <div id="header">
                <button class="button" :style="{ marginRight: '1rem' }" @click="handleBackNavigation">
                    <picture class="centered">
                        <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/chevron/chevron.left.svg"/>
                    </picture>
                </button>

                <button class="button" @click="eventSettingsModalRef?.show()">
                    <picture class="centered">
                        <source srcset="@/assets/icons/gear/gear.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/gear/gear.svg"/>
                    </picture>
                </button>
            </div>

            <!-- Title -->
            <input id="event-title" type="text" placeholder="New Event" v-model="eventTitle" class="text-input"/>

            <!-- Config -->
            <div id="event-type-config">
                <EventTypePicker v-model:model-value="eventType"/>
                
                <EventVisibilityPicker v-model:model-value="eventVisibility"/>
                
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

            <!-- Description -->
            <div id="event-description" :class="{ 'event-section': true }">
                <div :class="{ 
                    label: newEventError !== NEW_EVENT_ERROR.NO_DESCRIPTION, 
                    error: newEventError === NEW_EVENT_ERROR.NO_DESCRIPTION 
                }"> Description <div class="asterisk">*</div> </div>
                <div class="sub-label"> Give details about the event </div>
                <textarea type="text" v-model="eventDescription" class="text-large"/>
            </div>

           <!-- Start Date -->
           <div id="event-start-date-picker" :class="{ 'event-section': true }">
                <div 
                    :class="{
                        label: newEventError !== NEW_EVENT_ERROR.INVALID_START_DATE,
                        error: newEventError === NEW_EVENT_ERROR.INVALID_START_DATE 
                    }"
                > Start Date/Time <div class="asterisk">*</div> </div>
                <div class="sub-label"> When does this event start? </div>
                <DatePicker 
                    class="date-picker"
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
                />
            </div>

            <!-- End Date -->
            <div id="event-end-date-picker" :class="{ 'event-section': true }">
                <div
                    :class="{
                        label: newEventError !== NEW_EVENT_ERROR.INVALID_END_DATE,
                        error: newEventError === NEW_EVENT_ERROR.INVALID_END_DATE 
                    }
                "> End Date/Time<div class="asterisk">*</div>  </div>
                <div class="sub-label"> When does this event end? </div>
                <DatePicker 
                    class="date-picker"
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
                                'background-color': 'var(--secondary-background-color)'
                            }
                        }),
                        input: () => ({
                            style: {
                                'border': 'unset',
                                'outline': 'unset',
                                'color': 'var(--primary-label-color)',
                                'background-color': 'var(--secondary-background-color)'
                            }
                        }),
                    }"
                />
            </div>
        </div>
        <div id="right">
            <!-- Venues Picker -->
            <div id="event-venue-picker" 
                :class="{ 'event-section': true }"
                :style="{ marginTop: '2.5rem '}"
            >
                <div :class="{ 
                    label: newEventError !== NEW_EVENT_ERROR.NO_VENUES, 
                    error: newEventError === NEW_EVENT_ERROR.NO_VENUES 
                }"> Venue(s) <div class="asterisk">*</div> </div>
                <div class="sub-label"> The location for this event </div>
                <EventVenuesPicker v-model:model-value="eventVenues"/>
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

        <dialog id="event-settings-modal" ref="eventSettingsModal" class="dialog">
            <EventAdvancedSettings @close="eventSettingsModalRef?.close()"/>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { SPORTS, VIEW_STATE } from '~/data/Enums';
import { GroupSelection, VenueDescriptor } from '~/data/models/GenericModels';
import { EVENT_SKILL_LEVEL, EVENT_TYPE, EVENT_VISIBILITY } from '~/data/Enums';
import { NEW_EVENT_ERROR, NewEventManager } from '~/data/managers/NewEventManager';

import DatePicker from 'primevue/datepicker';
import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
import MultiSportsPicker from '~/components/MultiSportsPicker/MultiSportsPicker.vue';
import EventTypePicker from '~/components/Events/New Event/EventTypePicker/EventTypePicker.vue';
import EventImagePicker from '~/components/Events/New Event/EventImagePicker/EventImagePicker.vue';
import BoldTextButton from '~/components/Buttons/LoadingButtons/BoldTextButton/BoldTextButton.vue';
import EventVenuesPicker from '~/components/Events/New Event/EventVenuesPicker/EventVenuesPicker.vue';
import EventAdvancedSettings from '~/components/Events/New Event/EventAdvancedSettings/EventAdvancedSettings.vue';
import EventVisibilityPicker from '~/components/Events/New Event/EventVisibilityPicker/EventVisibilityPicker.vue';
import EventSkillLevelPicker from '~/components/Events/New Event/EventSkillLevelPicker/EventSkillLevelPicker.vue';
import EventOrganizersPicker from '~/components/Events/New Event/EventOrganizersPicker/EventOrganizersPicker.vue';

const router = useRouter();
const state = ref<VIEW_STATE>(VIEW_STATE.PENDING);
const manager: NewEventManager = new NewEventManager();
const newEventError = ref<NEW_EVENT_ERROR | null>(null);

const eventSport = computed<SPORTS>(() => {
    return eventSports.value[0] ?? SPORTS.RUNNING;
});

const eventTitle = ref<string>('');
const eventImage = ref<string>('');
const eventDescription = ref<string>('');
const eventMinParticipants = ref<number>(0);
const eventMaxParticipants = ref<number>(0);
const eventGroups = ref<GroupSelection[]>([]);
const eventVenues = ref<VenueDescriptor[]>([]);
const eventSports = ref<SPORTS[]>([SPORTS.RUNNING]);
const eventType = ref<EVENT_TYPE>(EVENT_TYPE.REGULAR);
const eventVisibility = ref<EVENT_VISIBILITY>(EVENT_VISIBILITY.PUBLIC);
const eventSkillLevel = ref<EVENT_SKILL_LEVEL>(EVENT_SKILL_LEVEL.ANY_LEVEL);

const eventStartDate = ref<Date>(new Date());
const eventEndDate = ref<Date>(new Date(eventStartDate.value.getTime() + (60 * 60 * 1000)));

const eventSettingsModalRef = useTemplateRef<HTMLDialogElement>('eventSettingsModal');
 
function createNewEvent() {
    state.value = VIEW_STATE.LOADING;

    const isInvalid = manager.validateNewEventData(
        eventTitle.value,
        eventDescription.value,
        eventGroups.value,
        eventVenues.value,
        eventImage.value,
        eventStartDate.value,
        eventEndDate.value
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
            eventMinParticipants.value,
            eventMaxParticipants.value
        );

        if (data) {
            manager.createNewEvent(data)
                .then((id: string | null) => {
                    if (!id) throw('No ID returned by the server.')
                    state.value = VIEW_STATE.SUCCESS;
                    router.push(`/events/${id}`);
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

function handleBackNavigation() {
    router.push('/events');
}

useSeoMeta({
    title: () => 'New Event | Olympsis',
    description: () => 'Creating a new event on Olympsis',
    
    ogType: 'website',
    ogLocale: 'en_US',
    ogSiteName: 'Olympsis',
    ogUrl: () => `https://olympsis.com/events`,
    ogTitle: () => eventTitle.value,
    ogDescription: () => 'Creating a new event on Olympsis',

    twitterSite: '@olympsis',
    twitterTitle: () => 'New Event | Olympsis',
    twitterCard: 'summary_large_image',
    twitterDescription: () => 'Creating a new event on Olympsis'
});
</script>

<style scoped>
#new-event-view {
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: var(--primary-background-color);

    #left {
        display: flex;
        max-width: 30rem;
        flex-direction: column;

        #event-title {
            height: 3rem;
            border: unset;
            font-size: 2.5rem;
            font-weight: bold;
            padding: 0rem 1rem;
            background-color: var(--primary-background-color);
        }

        #event-type-config {
            margin: 1rem;
            display: flex;
            max-width: 22rem;
            justify-content: space-between;

            .spacer {
                margin: 0rem 0.5rem;
            }
        }

        #note {
            font-size: 0.9rem;
            margin: 0.2rem 1rem;
            color: var(--tertiary-brand-color);
        }
    }

    #right {
        display: flex;
        max-width: 30rem;
        margin-left: 2rem;
        flex-direction: column;

        #action-wrapper {
            margin-top: 5rem;
        }
    }
}

@media (max-width: 1030px) {
#new-event-view {
    display: flex;
    flex-direction: column;

    #right {
        margin-left: unset;

        #action-wrapper {
            margin-bottom: 10rem;
        }
    }
}
}

#header {
    display: flex;
    padding: 1rem;

    h1 {
        font-size: 1rem;
        font-style: italic;
        text-transform: uppercase;
        color: var(--primary-label-color);
    }
}

.centered {
    display: flex;
    align-items: center;
    justify-content: center;
}

.button {
    all: unset;
    cursor: pointer;
    padding: 0.5rem;
    height: fit-content;
    border-radius: 10px;
    background-color: var(--secondary-background-color);

    &:hover {
        transform: scale(1.1);
    }
}

.date-picker {
    padding: 0.5rem;
    border-radius: 10px;
    background-color: var(--secondary-background-color);
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
        background-color: var(--secondary-background-color);
    }

    .text-large {
        width: 100%;
        height: 6rem;
        border: unset;
        padding: 0.5rem;
        font-size: 1.3rem;
        border-radius: 10px;
        color: var(--primary-label-color);
        background-color: var(--secondary-background-color);
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

#event-settings-modal{
    top: 0;
    border: unset;
    background: transparent;
    backdrop-filter: blur(5px);

    #event-advanced-settings {
        border-radius: 20px;
        max-width: 25rem !important;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    }

}
</style>