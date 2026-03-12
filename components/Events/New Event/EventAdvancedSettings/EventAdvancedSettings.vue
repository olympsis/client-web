<template>
    <div id="event-advanced-settings">
        <!-- Poster option (temporarily disabled) -->
        <!-- <div id="hide-poster" class="section" :style="{ display: 'flex', flexDirection: 'row'}">
            <div id="left">
                <h4>{{ t('events.advanced.hidePoster') }}</h4>
                <div class="sub-header">{{ t('events.advanced.hidePosterSub') }}</div>
            </div>
            <ToggleSwitch v-model="hidePoster" :style="{ 'margin-left': '1rem', 'margin-top': '0.5rem' }"/>
        </div> -->

        <!-- Participant options -->
        <div id="participants" class="section">
            <h3 class="header">
                {{ t('events.advanced.participants') }}
                <div :style="{ marginRight: '1rem', cursor: 'pointer' }" @click="showParticipantOptions = !showParticipantOptions">
                    <picture class="centered">
                        <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/chevron/chevron.left.svg" class="chevron" :class="{ open: showParticipantOptions == true }"/>
                    </picture>
                </div>
            </h3>

            <div class="sub-header" v-if="!showParticipantOptions">
                {{ t('events.advanced.participantsSub') }}
            </div>

            <div class="sub-section" v-if="showParticipantOptions">
                <div class="sub-section-header">{{ t('events.advanced.minParticipants') }}</div>
                <div class="sub-section-sub-header">{{ t('events.advanced.minParticipantsSub') }}</div>

                <div id="input" class="participants-slider">
                    <input type="number" min="0" v-model="min"/>
                </div>
            </div>

            <div class="sub-section" v-if="showParticipantOptions">
                <div class="sub-section-header">{{ t('events.advanced.maxParticipants') }}</div>
                <div class="sub-section-sub-header">{{ t('events.advanced.maxParticipantsSub') }}</div>

                <div id="input" class="participants-slider">
                    <input type="number" min="0" v-model="max"/>
                </div>
            </div>

            <div class="sub-section" v-if="showParticipantOptions">
                <div class="sub-section-header">
                    {{ t('events.advanced.waitlist') }}
                </div>
                <div class="sub-section-sub-header">
                    {{ t('events.advanced.waitlistSub') }}
                </div>

                <div id="input" :style="{ marginTop: '0.5rem', marginLeft: 'auto' }">
                    <ToggleSwitch v-model="hasWaitlist"/>
                </div>
            </div>
        </div>

        <!-- Formatting options-->
        <div id="event-format" class="section">
            <h3 class="header">
                {{ t('events.advanced.eventFormat') }}
                <div :style="{ marginRight: '1rem', cursor: 'pointer' }" @click="showEventFormatOptions = !showEventFormatOptions">
                    <picture class="centered">
                        <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/chevron/chevron.left.svg" class="chevron" :class="{ open: showEventFormatOptions == true }"/>
                    </picture>
                </div>
            </h3>

            <div class="sub-header" v-if="!showEventFormatOptions">
                {{ t('events.advanced.eventFormatSub') }}
            </div>

            <div class="sub-section" v-if="showEventFormatOptions">
                <div class="competition">
                    <div class="text">
                        <div class="sub-section-header">{{ t('events.advanced.isTournament') }}</div>
                        <div class="sub-section-sub-header">{{ t('events.advanced.isTournamentSub') }}</div>
                    </div>
                    <ToggleSwitch v-model="isCompetition"/>
                </div>

                <div class="formats">
                    <CompetitionFormats 
                        v-model:selectedSport="manager.selectedSport"
                        v-model:selectedFormats="selectedFormats"
                    />
                </div>
            </div>
        </div>

        <!-- Recurrence options -->
        <div id="recurrence" class="section">
            <h3 class="header">
                {{ t('events.advanced.recurring') }}
                <div :style="{ marginRight: '1rem', cursor: 'pointer' }" @click="showRecurrenceOptions = !showRecurrenceOptions">
                    <picture class="centered">
                        <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/chevron/chevron.left.svg" class="chevron" :class="{ open: showRecurrenceOptions == true }"/>
                    </picture>
                </div>
            </h3>

            <div class="sub-header" v-if="!showRecurrenceOptions">
                {{ t('events.advanced.recurringSub') }}
            </div>

            <div class="sub-section" v-if="showRecurrenceOptions">
                <div class="sub-section-header">
                    {{ t('events.advanced.frequency') }}
                </div>
                <div class="sub-section-sub-header">
                    {{ t('events.advanced.frequencySub') }}
                </div>

                <div :style="{ display: 'flex', fontSize: '0.8rem', alignItems: 'center', marginLeft: '1rem', fontWeight: 'bold', lineHeight: '0.5rem', marginTop: '1rem' }">
                    {{ t('events.advanced.every') }}
                    <input type="number" min="1" :style="{ width: '4rem', marginLeft: '0.5rem', marginTop: 'unset' }" class="input" v-model="recurrenceInterval"/>
                </div>

                <div class="actions">
                    <button 
                        @click="frequency = EVENT_RECURRENCE_FREQUENCY.WEEKLY"
                        :class="{selected: frequency === EVENT_RECURRENCE_FREQUENCY.WEEKLY}"
                    >
                        {{ t('events.advanced.weekly') }}
                    </button>
                    <button
                        @click="frequency = EVENT_RECURRENCE_FREQUENCY.MONTHLY"
                        :class="{selected: frequency === EVENT_RECURRENCE_FREQUENCY.MONTHLY}"
                    >
                        {{ t('events.advanced.monthly') }}
                    </button>
                </div>
            </div>

            <div class="sub-section" v-if="showRecurrenceOptions">
                <div class="sub-section-header">
                    {{ t('events.advanced.endDate') }}
                </div>
                <div class="sub-section-sub-header">
                    {{ t('events.advanced.endDateSub') }}
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

        <!-- External links -->
        <div id="externalLinks" class="section">
            <h3 class="header">
                {{ t('events.advanced.externalLinks') }}
                <div :style="{ marginRight: '1rem', cursor: 'pointer' }" @click="showExternalLinksOption = !showExternalLinksOption">
                    <picture class="centered">
                        <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/chevron/chevron.left.svg" class="chevron" :class="{ open: showExternalLinksOption == true }"/>
                    </picture>
                </div>
            </h3>

            <div class="sub-header" v-if="!showExternalLinksOption">
                {{ t('events.advanced.externalLinksSub') }}
            </div>

            <div v-if="showExternalLinksOption" class="external-links-list">
                <!-- Link cards -->
                <div v-for="(draft, index) in linkDrafts" :key="index" class="link-card">
                    <div class="link-card-header">
                        <span class="link-card-label">{{ index + 1 }}</span>
                        <button class="button" @click="removeLink(index)">
                            <picture class="centered">
                                <source srcset="@/assets/icons/xmark/xmark.white.svg" media="(prefers-color-scheme: dark)">
                                <img src="@/assets/icons/xmark/xmark.svg">
                            </picture>
                        </button>
                    </div>
                    <input class="input title-input" v-model="draft.title" :placeholder="t('events.advanced.linkTitle')"/>
                    <input
                        class="input"
                        :class="{ 'invalid-url': draft.url.trim() !== '' && !isValidURL(draft.url.trim()) }"
                        v-model="draft.url"
                        :placeholder="t('events.advanced.linkURL')"
                    />
                </div>

                <!-- Add link button -->
                <button v-if="linkDrafts.length < MAX_EXTERNAL_LINKS" class="add-link-btn" @click="addLink">
                    + {{ t('events.advanced.addLink') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import DatePicker from 'primevue/datepicker';
import ToggleSwitch from 'primevue/toggleswitch';
import CompetitionFormats from '../CompetitionFormats/CompetitionFormats.vue';
import { COMPETITION_FORMAT, EVENT_RECURRENCE_FREQUENCY } from '~/data/Enums';
import { RecurrenceOptions, ParticipantsConfig, EventConfig, EventFormatConfig, EventLink } from '~/data/models/EventModels';

const { t } = useI18n();
const manager = useNewEventManager();

const showRecurrenceOptions = ref<boolean>(false);
const showParticipantOptions = ref<boolean>(false);
const showExternalLinksOption = ref<boolean>(false);
const showEventFormatOptions = ref<boolean>(false);

const min = ref<number>(0);
const max = ref<number>(0);
const hidePoster = ref<boolean>(false);
const endDate = ref<Date>(new Date());
const hasWaitlist = ref<boolean>(false);
const recurrenceInterval = ref<number>(1);
const frequency = ref<EVENT_RECURRENCE_FREQUENCY>(EVENT_RECURRENCE_FREQUENCY.WEEKLY);

const isCompetition = ref<boolean>(false);
const selectedFormats = ref<COMPETITION_FORMAT[]>([]);

/** Maximum number of external links allowed per event */
const MAX_EXTERNAL_LINKS = 3;

/** Local drafts for external links — each entry has a title and url */
const linkDrafts = reactive<{ title: string, url: string }[]>([]);

function addLink() {
    if (linkDrafts.length >= MAX_EXTERNAL_LINKS) return;
    linkDrafts.push({ title: '', url: '' });
}

function removeLink(index: number) {
    linkDrafts.splice(index, 1);
}

/** Only allow http/https URLs to prevent javascript: and data: injection */
function isValidURL(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

/** Sync linkDrafts to the manager store, filtering out empty and invalid URLs */
watch(linkDrafts, (drafts) => {
    manager.externalLinks = drafts
        .filter((d) => d.url.trim() !== '' && isValidURL(d.url.trim()))
        .map((d) => new EventLink(d.title.trim() || t('events.advanced.externalLinks'), d.url.trim()));
}, { deep: true });

watch(hidePoster, () => {
    if (manager.config == undefined) {
        manager.config = new EventConfig(hidePoster.value)
    } else {
        manager.config.hidePoster = hidePoster.value
    }
}, { immediate: false });

watch(isCompetition, () => {
    if (manager.formatConfig == undefined) {
        manager.formatConfig = new EventFormatConfig(isCompetition.value)
    } else {
        manager.formatConfig.isCompetition = isCompetition.value;
    }
}, { immediate: false });

watch(min, () => {
    if (manager.participantsConfig == undefined) {
        manager.participantsConfig = new ParticipantsConfig(hasWaitlist.value, undefined, min.value, max.value);
    } else {
        manager.participantsConfig.minParticipants = min.value;
    }
}, { immediate: false });

watch(max, () => {
    if (manager.participantsConfig == undefined) {
        manager.participantsConfig = new ParticipantsConfig(hasWaitlist.value, undefined, min.value, max.value);
    } else {
        manager.participantsConfig.maxParticipants = max.value;
    }
}, { immediate: false });

watch(hasWaitlist, () => {
    if (manager.participantsConfig == undefined) {
        manager.participantsConfig = new ParticipantsConfig(hasWaitlist.value, undefined, min.value, max.value);
    } else {
        manager.participantsConfig.hasWaitlist = hasWaitlist.value;
    }
}, { immediate: false });

watch(frequency, () => {
    if (manager.recurrenceOptions == undefined) {
        manager.recurrenceOptions = new RecurrenceOptions(frequency.value.valueOf(), endDate.value, recurrenceInterval.value);
    } else { 
        manager.recurrenceOptions.pattern = frequency.value.valueOf();
    }
}, { immediate: false });

watch(recurrenceInterval, () => {
    if (manager.recurrenceOptions == undefined) {
        manager.recurrenceOptions = new RecurrenceOptions(frequency.value.valueOf(), endDate.value, recurrenceInterval.value);
    } else { 
        manager.recurrenceOptions.interval = recurrenceInterval.value;
    }
}, { immediate: false });

watch(endDate, () => {
    if (manager.recurrenceOptions == undefined) {
        manager.recurrenceOptions = new RecurrenceOptions(frequency.value.valueOf(), endDate.value, recurrenceInterval.value);
    } else { 
        manager.recurrenceOptions.endTime = endDate.value;
    }
}, { immediate: false });

onMounted(() => {
    // Restore hide poster
    if (manager.config != undefined) {
        hidePoster.value = manager.config.hidePoster ?? false;
    }

    // Restore participants config
    if (manager.participantsConfig != undefined) {
        min.value = manager.participantsConfig.minParticipants ?? 0;
        max.value = manager.participantsConfig.maxParticipants ?? 0;
        hasWaitlist.value = manager.participantsConfig.hasWaitlist ?? false;
        showParticipantOptions.value = true;
    }

    // Restore recurrence options
    if (manager.recurrenceOptions != undefined) {
        endDate.value = manager.recurrenceOptions.endTime;
        frequency.value = manager.recurrenceOptions.pattern == 'WEEKLY' ? EVENT_RECURRENCE_FREQUENCY.WEEKLY : EVENT_RECURRENCE_FREQUENCY.MONTHLY;
        recurrenceInterval.value = manager.recurrenceOptions.interval;
        showRecurrenceOptions.value = true
    }

    // Restore external links
    if (manager.externalLinks.length > 0) {
        manager.externalLinks.forEach((link) => {
            linkDrafts.push({ title: link.title ?? '', url: link.url ?? '' });
        });
        showExternalLinksOption.value = true;
    }

    // Restore format options
    if (manager.formatConfig != undefined) {
        isCompetition.value = manager.formatConfig.isCompetition ?? false;
        selectedFormats.value = manager.formatConfig.formats ?? [];
        showEventFormatOptions.value = true;
    }
});

onUnmounted(() => {
    if (manager.formatConfig == undefined) {
        manager.formatConfig = new EventFormatConfig(undefined, undefined, undefined, undefined, selectedFormats.value)
    } else {
        manager.formatConfig.formats = selectedFormats.value;
    }
});
</script>

<style scoped>
#event-advanced-settings {
    width: 100%;
    padding: 1rem;
    color: var(--primary-label-color);

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
        color: var(--secondary-label-color);
        font-size: 0.9rem;
    }
}

.sub-section {
    display: flex;
    margin: 0.25rem 0rem;
    flex-direction: column;

    .sub-section-header {
        font-size: 0.85rem;
        color: var(--primary-label-color);
    }

    .sub-section-sub-header {
        color: var(--secondary-label-color);
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
        color: var(--primary-label-color);
        background-color: var(--secondary-background-color);
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
    color: var(--primary-label-color);
    background-color: var(--secondary-background-color);
}

.actions {
    button {
        border: unset;
        margin: 0.5rem;
        cursor: pointer;
        border-radius: 10px;
        padding: 0.5rem 1rem;
        color: var(--primary-label-color);
        background-color: var(--secondary-background-color);

        &.selected {
            border: 3px solid var(--primary-brand-color) !important;
        }
    }
}

.competition {
    display: flex;
}

.external-links-list {
    margin-top: 0.5rem;
}

.link-card {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border-radius: 10px;
    border: 1px solid var(--component-border);
    background-color: var(--secondary-background-color);

    .link-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.25rem;

        .link-card-label {
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--primary-label-color);
        }

        .button {
            width: 1.25rem;
            height: 1.25rem;
            cursor: pointer;
            border-radius: 50%;
            border: 1px solid var(--component-border);
            background-color: var(--tertiary-background-color);

            &:hover {
                transform: scale(1.1);
            }
        }
    }

    .input {
        margin-top: 0.25rem;
        font-size: 0.85rem;
    }

    .title-input {
        font-weight: 600;
    }

    .invalid-url {
        border: 1px solid #e74c3c !important;
    }
}

.add-link-btn {
    width: 100%;
    border: unset;
    cursor: pointer;
    padding: 0.5rem;
    margin-top: 0.25rem;
    font-size: 0.85rem;
    border-radius: 10px;
    color: var(--primary-label-color);
    background-color: var(--secondary-background-color);

    &:hover {
        opacity: 0.8;
    }
}
</style>