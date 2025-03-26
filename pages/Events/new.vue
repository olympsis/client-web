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
            </div>

            <!-- Title -->
            <input 
                id="event-title"
                :class="{
                    label: newEventError !== NEW_EVENT_ERROR.NO_TITLE, 
                    'title-error': newEventError === NEW_EVENT_ERROR.NO_TITLE 
                }"
                class="text-input"
                type="text" 
                placeholder="Event Title" 
                v-model="eventTitle" 
            />

            <!-- Config -->
            <div id="event-type-config">
                <EventTypePicker v-model:model-value="eventType" :style="{marginRight: '0.5rem'}"/>
                <EventVisibilityPicker v-model:model-value="eventVisibility"/>
            </div>

            <div id="note">
                *fields required.
            </div>

            <!-- Sports Picker -->
            <div id="event-sports-picker">
                <div class="label">Event Sport</div>
                <div class="sub-label"> Choose the event's sport activity </div>
                <MultiSportsPicker v-model:model-value="eventSports" :sports="session.sports"/>
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
                :style="{ margin: 'unset', marginTop: '2.5rem', marginBottom: '1rem' }"
            >
                <div :class="{ 
                    label: newEventError !== NEW_EVENT_ERROR.NO_VENUES, 
                    error: newEventError === NEW_EVENT_ERROR.NO_VENUES 
                }"> Location(s) <div class="asterisk">*</div> </div>
                <div class="sub-label"> Select your event's location(s) </div>
                <EventVenuesPicker v-model:model-value="eventVenues"/>
            </div>

            <!-- Image Picker -->
            <div id="event-image-picker" v-if="eventSports.length > 0">
                <EventImagePicker v-model:selected-sport="eventSport" v-model:selected-image="eventImage" />
            </div>

            <!-- Event Tags -->
            <div id="event-tags-picker">
                <div class="label">Event Tags</div>
                <div class="sub-label"> Tags make your event easier to discover. Add a few! </div>
                
                <MultiTagsPicker :tags="session.tags" v-model:model-value="eventTags"/>
            </div>

            <!-- Advanced Settings -->
            <div id="advanced-settings" @click="showAdvancedSettings = true">
                Advanced Settings
                <picture class="centered">
                    <source srcset="@/assets/icons/gear/gear.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/gear/gear.svg"/>
                </picture>
            </div>

            <!-- Primary Action -->
            <div id="action-wrapper">
                <BoldTextButton v-model="state" text="create event" @click="createNewEvent"/>
            </div>
        </div>

        <Drawer v-model:visible="showAdvancedSettings" position="right">
            <template #container="{ closeCallback }">
                <div id="header" :style="{ display: 'flex', alignItems: 'center' }">
                    <h2>Advanced Settings</h2>
                    <button class="button" :style="{ marginRight: '1rem', marginLeft: 'auto' }" @click="closeCallback">
                        <picture class="centered">
                            <source srcset="@/assets/icons/xmark/xmark.white.svg" media="(prefers-color-scheme: dark)">
                            <img src="@/assets/icons/xmark/xmark.svg"/>
                        </picture>
                    </button>
                </div>
                
                <EventAdvancedSettings
                    v-model:participants-config="participantsConfig"
                    v-model:external-link="eventExternalLink"
                    v-model:recurrence-options="eventRecurrenceOptions"
                />
            </template>
        </Drawer>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { EVENT_TYPE, EVENT_VISIBILITY } from '~/data/Enums';
import { VIEW_STATE, EVENT_RECURRENCE_FREQUENCY, MEDIA_TYPE } from '~/data/Enums';
import { NEW_EVENT_ERROR, NewEventManager } from '~/data/managers/NewEventManager';
import { GroupSelection, Sport, Tag, VenueDescriptor } from '~/data/models/GenericModels';
import { EventFormatConfig, ParticipantsConfig, RecurrenceOptions } from '~/data/models/EventModels';

import Drawer from 'primevue/drawer';
import DatePicker from 'primevue/datepicker';
import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
import MultiTagsPicker from '~/components/MultiTagsPicker.vue/MultiTagsPicker.vue';
import MultiSportsPicker from '~/components/MultiSportsPicker/MultiSportsPicker.vue';
import EventTypePicker from '~/components/Events/New Event/EventTypePicker/EventTypePicker.vue';
import EventImagePicker from '~/components/Events/New Event/EventImagePicker/EventImagePicker.vue';
import BoldTextButton from '~/components/Buttons/LoadingButtons/BoldTextButton/BoldTextButton.vue';
import EventVenuesPicker from '~/components/Events/New Event/EventVenuesPicker/EventVenuesPicker.vue';
import EventAdvancedSettings from '~/components/Events/New Event/EventAdvancedSettings/EventAdvancedSettings.vue';
import EventVisibilityPicker from '~/components/Events/New Event/EventVisibilityPicker/EventVisibilityPicker.vue';
import EventOrganizersPicker from '~/components/Events/New Event/EventOrganizersPicker/EventOrganizersPicker.vue';


const toast = useToast();
const router = useRouter();
const session = useSessionStore();
const state = ref<VIEW_STATE>(VIEW_STATE.PENDING);
const manager: NewEventManager = new NewEventManager();
const newEventError = ref<NEW_EVENT_ERROR | null>(null);

const eventSport = computed<Sport>(() => {
    return eventSports.value[0];
});

const showAdvancedSettings = ref<boolean>(false);

const eventTitle = ref<string>('');
const eventImage = ref<string>('');
const eventDescription = ref<string>('');

const eventTags = ref<Tag[]>([]);
const eventSports = ref<Sport[]>([]);
const eventExternalLink = ref<string>('');

const eventGroups = ref<GroupSelection[]>([]);
const eventVenues = ref<VenueDescriptor[]>([]);
const eventType = ref<EVENT_TYPE>(EVENT_TYPE.REGULAR);
const eventVisibility = ref<EVENT_VISIBILITY>(EVENT_VISIBILITY.PUBLIC);

const eventStartDate = ref<Date>(new Date());
const eventEndDate = ref<Date>(new Date(eventStartDate.value.getTime() + (60 * 60 * 1000)));

const eventFormatConfig = ref<EventFormatConfig | undefined>(undefined);
const participantsConfig = ref<ParticipantsConfig | undefined>(undefined);
const eventRecurrenceOptions = ref<RecurrenceOptions | undefined>(undefined);
 
function createNewEvent() {
    state.value = VIEW_STATE.LOADING;

    try {
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
                eventVisibility.value,
                eventGroups.value,
                eventTags.value,
                [eventSport.value],
                eventTitle.value,
                eventDescription.value,
                eventVenues.value,
                eventStartDate.value,
                eventEndDate.value,
                MEDIA_TYPE.IMAGE,
                eventImage.value,
                eventFormatConfig.value,
                participantsConfig.value,
                undefined,
                eventExternalLink.value
            );

            if (data) {
                let opts: RecurrenceOptions | undefined;
                if (eventRecurrenceOptions.value != undefined) {
                    opts = eventRecurrenceOptions.value;
                }
                
                manager.createNewEvent(data, opts)
                    .then((id: string | null) => {
                        if (!id) throw('No ID returned by the server.')
                        state.value = VIEW_STATE.SUCCESS;
                        setTimeout(() => {
                            router.push(`/events/${id}`);
                        }, 500);
                    })
                    .catch((error: any) => {
                        state.value = VIEW_STATE.FAILURE;
                        console.error('Failed to create event. Error: ', error);
                        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create event!', life: 3000 });
                        setTimeout(() => {
                            state.value = VIEW_STATE.PENDING;
                        }, 250);
                    });
            }
        }
    } catch(error) {
        state.value = VIEW_STATE.FAILURE;
        // URGENT: DEV ENV ONLY
        console.error(`Failed to create event. Error: ${error}`);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Could not create event!', life: 3000 });
    }
}

function handleBackNavigation() {
    const previousRoute = router.options.history.state.back;

    if (previousRoute === '/groups') {
        router.push('/groups');
    } else {
        router.push('/events');
    }
}

onMounted(() => {
    if (session.sports.length > 0) {
        eventSports.value.push(session.sports[0])
    }
});

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
            border-radius: 10px;
            background-color: var(--secondary-background-color);
        }

        #event-type-config {
            gap: 0.5rem;
            display: flex;
            max-width: 22rem;
            margin: 0.5rem 1rem;
        }

        #note {
            font-size: 0.9rem;
            margin: 0rem 0.5rem;
            margin-bottom: 1rem;
            color: var(--tertiary-brand-color);
        }
    }

    #right {
        display: flex;
        max-width: 30rem;
        margin-left: 2rem;
        flex-direction: column;

        #advanced-settings {
            gap: 0.5rem;
            margin: 1rem 0rem;
            display: flex;
            cursor: pointer;
            font-weight: bold;
            align-items: center;
        }

        #action-wrapper {
            margin-top: 5rem;
        }
    }
}

@media (max-width: 1030px) {
#new-event-view {
    width: 100%;
    display: flex;
    flex-direction: column;

    #left {
        width: 100%;
        margin: 0 auto;
    }

    #right {
        width: 100%;
        margin: 0 auto;

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
}

.label {
    display: flex;
    font-weight: 500;
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

.error {
    color: red;
    display: flex;
    font-weight: bold;
}

.title-error {
    border: 1px solid red !important;
}

.asterisk {
    color: var(--tertiary-brand-color);
}

#event-sports-picker {
    margin: 0rem 1rem;
}

#event-tags-picker {
    margin-top: 1rem;
}
</style>