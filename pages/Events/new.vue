<template>
    <div id="new-event-view">
        <div id="left">
            <!-- Header -->
            <div id="header">
                <button class="button glass" :style="{ marginRight: '1rem' }" @click="handleBackNavigation">
                    <picture class="centered">
                        <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/chevron/chevron.left.svg"/>
                    </picture>
                </button>
            </div>

            <div id="section-one" class="section">
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

                <div class="divider"></div>

                <!-- Config -->
                <div id="event-type-config">
                    <EventTypePicker v-model:model-value="manager.eventType"/>
                    <EventVisibilityPicker v-model:model-value="manager.visibility"/>
                </div>

                <div class="divider"></div>

                <div id="event-time" :style="{'display': 'flex'}">
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
            </div>

            <div id="section-two">
                <EventHostsCard :poster="session.user?.toUserSnippet()" :sponsors="[]" :organizers="[]"/>
            </div>

            <div id="section-three" class="section">
                <!-- Sports Picker -->
                <div id="event-sports-picker">
                    <h4>{{ t('events.new.sport') }}</h4>
                    <div class="sub-label"> {{ t('events.new.sportSub') }} </div>
                    <MultiSportsPicker v-model:model-value="eventSports" :sports="session.sports"/>
                </div>

                <div class="divider"></div>

                <!-- Body -->
                <div id="event-description">
                    <h4 :class="{
                        error: newEventError === NEW_EVENT_ERROR.NO_DESCRIPTION
                    }"> {{ t('events.new.description') }} </h4>
                    <div class="sub-label"> {{ t('events.new.descriptionSub') }} </div>
                    <EventDescriptionEditor v-model="manager.description" />
                </div>
            </div>           
        </div>

        <div id="right">
            <!-- Venues Picker -->
            <EventVenuesPicker class="venue-padding" v-model:model-value="manager.venues"/>

            <!-- Image Picker -->
            <div id="event-image-picker" v-if="eventSports.length > 0">
                <EventImagePicker v-model:selected-sport="eventSport" v-model:selected-image="manager.image" />
            </div>

            <!-- Event Tags -->
            <div id="event-tags-picker" class="section">
                <h4>{{ t('events.new.tags') }}</h4>
                <div class="sub-label"> {{ t('events.new.tagsSub') }} </div>

                <MultiTagsPicker :tags="session.tags" v-model:model-value="manager.tags"/>
            </div>

            <!-- Advanced Settings -->
            <button id="advanced-settings" class="glass" @click="showAdvancedSettings = true">
                <picture class="centered">
                    <source srcset="@/assets/icons/gear/gear.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/gear/gear.svg"/>
                </picture>
                {{ t('events.new.advancedSettings') }}
            </button>

            <!-- Primary Action -->
            <div id="action-wrapper">
                <BoldTextButton v-model="state" :text="t('events.new.createEvent')" @click="createNewEvent"/>
            </div>
        </div>

        <Drawer
            v-model:visible="showAdvancedSettings"
            position="right"
            :pt="{
                root: {
                    style: {
                        'background-color': 'var(--primary-background-color)',
                        'color': 'var(--primary-label-color)',
                    }
                }
            }"
        >
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
                    v-model:participants-config="manager.participantsConfig"
                    v-model:recurrence-options="manager.recurrenceOptions"
                />
            </template>
        </Drawer>

        <!-- Auth Modal - shown when unauthenticated user tries to create an event -->
        <dialog id="auth-modal" ref="auth-modal" class="dialog">
            <AuthModal class="auth-card" @cancel="hideAuthModal" @user-authenticated="handleNewUserAuthentication"/>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import {  Sport } from '~/data/models/GenericModels';
import { VIEW_STATE, NEW_EVENT_ERROR } from '~/data/Enums';

import Drawer from 'primevue/drawer';
import DatePicker from 'primevue/datepicker';
import MultiTagsPicker from '~/components/MultiTagsPicker.vue/MultiTagsPicker.vue';
import MultiSportsPicker from '~/components/MultiSportsPicker/MultiSportsPicker.vue';
import EventTypePicker from '~/components/Events/New Event/EventTypePicker/EventTypePicker.vue';
import EventImagePicker from '~/components/Events/New Event/EventImagePicker/EventImagePicker.vue';
import BoldTextButton from '~/components/Buttons/LoadingButtons/BoldTextButton/BoldTextButton.vue';
import EventVenuesPicker from '~/components/Events/New Event/EventVenuesPicker/EventVenuesPicker.vue';
import EventAdvancedSettings from '~/components/Events/New Event/EventAdvancedSettings/EventAdvancedSettings.vue';
import EventVisibilityPicker from '~/components/Events/New Event/EventVisibilityPicker/EventVisibilityPicker.vue';
import EventHostsCard from '~/components/Events/New Event/EventHostsCard/EventHostsCard.vue';
import AuthModal from '@/components/Auth/AuthModal/AuthModal.vue';
import EventDescriptionEditor from '~/components/Events/New Event/EventDescriptionEditor/EventDescriptionEditor.vue';


const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const auth = useAuth();
const session = useSessionStore();
const manager = useNewEventManager();

const authModal = useTemplateRef<HTMLDialogElement>('auth-modal');

const isAuthenticated = computed<boolean>(() => {
    return auth.isAuthenticated.value;
});
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
 
function showAuthModal() {
    if (authModal.value) {
        authModal.value.showModal();
    } else {
        console.error('Failed to find reference to Auth Modal');
    }
}

function hideAuthModal() {
    if (authModal.value) {
        authModal.value.close();
    } else {
        console.error('Failed to find reference to Auth Modal');
    }
}

function handleNewUserAuthentication() {
    auth.initAuth();
    session.init();
    hideAuthModal();
}

function createNewEvent() {
    // Show auth modal if user is not authenticated
    if (!isAuthenticated.value) {
        showAuthModal();
        return;
    }

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

onUnmounted(() => {
    manager.$reset();
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
            font-family: 'Archivo';
            background-color: var(--component-background-color);
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
            all: unset;
            gap: 0.5rem;
            cursor: pointer;
            font-weight: 500;
            margin: 1rem 0rem;
            width: fit-content;
            align-items: center;
            border-radius: 25px;
            display: inline-flex;
            padding: 0.5rem 1.25rem;
            backdrop-filter: blur(20px);
            color: var(--primary-label-color);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--component-border);
            background-color: var(--secondary-background-color);

            &:hover {
                background-color: var(--tertiary-background-color);
            }
        }

        #action-wrapper {
            margin-top: 5rem;
        }
    }
}

.venue-padding {
    margin-top: 4rem;
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

.venue-padding {
    margin-top: 1rem;
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

.section {
    padding: 1rem;
    border-radius: 20px;
    border: 1px solid var(--component-border-color);
    background-color: var(--component-background-color);
}

.divider {
    height: 2px;
    width: 100%;
    background-color: var(--divider-color);
}

.centered {
    display: flex;
    align-items: center;
    justify-content: center;
}

.button {
    all: unset;
    cursor: pointer;
    height: fit-content;
    border-radius: 10px;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--component-border-color);
    background-color: var(--secondary-background-color);

    &:hover {
        transform: scale(1.1);
        background-color: var(--tertiary-background-color);
    }
}

.date-picker {
    border-radius: 10px;
    background-color: var(--secondary-background-color);
}

.event-section {
    margin: 1rem;
}

.label {
    display: flex;
    font-weight: 500;
    font-size: 0.9rem;
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

#event-image-picker {
    margin-top: 1rem;
}

#event-sports-picker {
    margin: 0rem;
}

#event-description {
    margin-top: 0.75rem;
}

#event-tags-picker {
    margin-top: 1rem;

    .sub-label {
        margin-bottom: 0.5rem;
    }
}

#auth-modal {
    border: unset;
    width: fit-content;
    height: fit-content;
    margin: auto;
    background: transparent;

    &::backdrop {
        backdrop-filter: blur(5px);
    }

    .auth-card {
        border-radius: 20px;
        max-width: 25rem !important;
        border: var(--component-border-color) solid 1px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        background: rgba(255, 255, 255, 0.12);
    }
}
</style>