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
                :placeholder="t('events.new.title')"
                v-model="manager.title" 
            />

            <!-- Config -->
            <div id="event-type-config">
                <EventTypePicker v-model:model-value="manager.eventType"/>
                <EventVisibilityPicker v-model:model-value="manager.visibility"/>
            </div>

            <div id="note">
                {{ t('events.new.fieldsRequired') }}
            </div>

            <!-- Sports Picker -->
            <div id="event-sports-picker">
                <div class="label">{{ t('events.new.sport') }}</div>
                <div class="sub-label"> {{ t('events.new.sportSub') }} </div>
                <MultiSportsPicker v-model:model-value="eventSports" :sports="session.sports"/>
            </div>

            <!-- Organizers Picker -->
            <div id="event-organizers-picker" class="event-section">
                <div :class="{ 
                    label: newEventError !== NEW_EVENT_ERROR.NO_ORGANIZERS, 
                    error: newEventError === NEW_EVENT_ERROR.NO_ORGANIZERS 
                }"> {{ t('events.new.organizers') }} <div class="asterisk">*</div> </div>
                <div class="sub-label"> {{ t('events.new.organizersSub') }} </div>
                <EventOrganizersPicker v-model:model-value="manager.groups"/>
            </div>

            <!-- Description -->
            <div id="event-description" :class="{ 'event-section': true }">
                <div :class="{ 
                    label: newEventError !== NEW_EVENT_ERROR.NO_DESCRIPTION, 
                    error: newEventError === NEW_EVENT_ERROR.NO_DESCRIPTION 
                }"> {{ t('events.new.description') }} <div class="asterisk">*</div> </div>
                <div class="sub-label"> {{ t('events.new.descriptionSub') }} </div>
                <textarea type="text" v-model="manager.description" class="text-large"/>
            </div>

           <!-- Start Date -->
           <div id="event-start-date-picker" :class="{ 'event-section': true }">
                <div 
                    :class="{
                        label: newEventError !== NEW_EVENT_ERROR.INVALID_START_DATE,
                        error: newEventError === NEW_EVENT_ERROR.INVALID_START_DATE 
                    }"
                > {{ t('events.new.startDate') }} <div class="asterisk">*</div> </div>
                <div class="sub-label"> {{ t('events.new.startDateSub') }} </div>
                <DatePicker 
                    class="date-picker"
                    v-model="manager.startDate" 
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
                "> {{ t('events.new.endDate') }}<div class="asterisk">*</div>  </div>
                <div class="sub-label"> {{ t('events.new.endDateSub') }} </div>
                <DatePicker 
                    class="date-picker"
                    v-model="manager.endDate" 
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
                }"> {{ t('events.new.locations') }} <div class="asterisk">*</div> </div>
                <div class="sub-label"> {{ t('events.new.locationsSub') }} </div>
                <EventVenuesPicker v-model:model-value="manager.venues"/>
            </div>

            <!-- Image Picker -->
            <div id="event-image-picker" v-if="eventSports.length > 0">
                <EventImagePicker v-model:selected-sport="eventSport" v-model:selected-image="manager.image" />
            </div>

            <!-- Event Tags -->
            <div id="event-tags-picker">
                <div class="label">{{ t('events.new.tags') }}</div>
                <div class="sub-label"> {{ t('events.new.tagsSub') }} </div>
                
                <MultiTagsPicker :tags="session.tags" v-model:model-value="manager.tags"/>
            </div>

            <!-- Advanced Settings -->
            <div id="advanced-settings" @click="showAdvancedSettings = true">
                {{ t('events.new.advancedSettings') }}
                <picture class="centered">
                    <source srcset="@/assets/icons/gear/gear.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/gear/gear.svg"/>
                </picture>
            </div>

            <!-- Primary Action -->
            <div id="action-wrapper">
                <BoldTextButton v-model="state" :text="t('events.new.createEvent')" @click="createNewEvent"/>
            </div>
        </div>

        <Drawer v-model:visible="showAdvancedSettings" position="right">
            <template #container="{ closeCallback }">
                <div id="header" :style="{ display: 'flex', alignItems: 'center' }">
                    <h2>{{ t('events.new.advancedSettings') }}</h2>
                    <button class="button" :style="{ marginRight: '1rem', marginLeft: 'auto' }" @click="closeCallback">
                        <picture class="centered">
                            <source srcset="@/assets/icons/xmark/xmark.white.svg" media="(prefers-color-scheme: dark)">
                            <img src="@/assets/icons/xmark/xmark.svg"/>
                        </picture>
                    </button>
                </div>
                
                <EventAdvancedSettings
                    v-model:event-config="manager.config"
                    v-model:teams-config="manager.teamsConfig"
                    v-model:external-link="manager.externalLink"
                    v-model:participants-config="manager.participantsConfig"
                    v-model:recurrence-options="manager.recurrenceOptions"
                />
            </template>
        </Drawer>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import {  Sport } from '~/data/models/GenericModels';
import { VIEW_STATE, NEW_EVENT_ERROR } from '~/data/Enums';

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


const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const session = useSessionStore();
const manager = useNewEventManager();
const state = ref<VIEW_STATE>(VIEW_STATE.PENDING);
const newEventError = ref<NEW_EVENT_ERROR | null>(null);

const eventSport = computed<Sport>(() => {
    return eventSports.value[0] as Sport;
});

const eventSports = ref<Sport[]>([]);
const showAdvancedSettings = ref<boolean>(false);


// Sports selection watcher
watch(eventSports, () => {
    if (eventSports.value.length == 0) return;
    manager.selectedSport = eventSports.value[0];
}, { immediate: true });
 
function createNewEvent() {
    state.value = VIEW_STATE.LOADING;

    try {
        const isInvalid = manager.validateNewEventData();
        
        if (isInvalid != null) {
            newEventError.value = isInvalid;
            state.value = VIEW_STATE.PENDING;
        } else {
            newEventError.value = null;
            manager.createNewEvent()
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
                    toast.add({ severity: 'error', summary: 'Error', detail: t('events.new.errorCreate'), life: 3000 });
                    setTimeout(() => {
                        state.value = VIEW_STATE.PENDING;
                    }, 250);
                });
        }
    } catch(error) {
        state.value = VIEW_STATE.FAILURE;
        // URGENT: DEV ENV ONLY
        console.error(`Failed to create event. Error: ${error}`);
        toast.add({ severity: 'error', summary: 'Error', detail: t('events.new.errorCouldNot'), life: 3000 });
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
        eventSports.value.push(session.sports[0] as Sport)
        manager.selectedSport = session.sports[0] as Sport;
    }
});

useSeoMeta({
    title: () => t('events.new.seoTitle'),
    description: () => t('events.new.seoDescription'),

    ogType: 'website',
    ogLocale: 'en_US',
    ogSiteName: 'Olympsis',
    ogUrl: () => `https://olympsis.com/events`,
    ogTitle: () => t('events.new.seoTitle'),
    ogDescription: () => t('events.new.seoDescription'),

    twitterSite: '@olympsis',
    twitterTitle: () => t('events.new.seoTitle'),
    twitterCard: 'summary_large_image',
    twitterDescription: () => t('events.new.seoDescription')
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