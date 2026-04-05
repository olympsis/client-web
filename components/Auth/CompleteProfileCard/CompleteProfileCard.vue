<template>
    <div id="complete-profile">
        <div id="content">
            <img src="@/assets/images/logo.png" class="icon logo-dark" />
            <img src="@/assets/images/logo.white.png" class="icon logo-light" />

            <h1>{{ t('auth.completeProfile.title') }}</h1>
            <p class="subtitle">{{ t('auth.completeProfile.subtitle') }}</p>

            <!-- Full Name -->
            <div class="field">
                <h3>{{ t('auth.completeProfile.fullName') }}</h3>
                <input
                    type="text"
                    v-model="fullName"
                    autocomplete="name"
                    :placeholder="t('auth.completeProfile.fullNamePlaceholder')"
                />
            </div>

            <!-- Email -->
            <div class="field">
                <h3>{{ t('auth.completeProfile.email') }}</h3>
                <input
                    type="email"
                    v-model="email"
                    autocomplete="email"
                    :placeholder="t('auth.completeProfile.emailPlaceholder')"
                />
            </div>

            <!-- Username -->
            <div class="field">
                <h3>{{ t('auth.completeProfile.username') }}</h3>
                <div class="input-wrapper">
                    <input
                        type="text"
                        v-model="username"
                        autocomplete="off"
                        :placeholder="t('auth.completeProfile.usernamePlaceholder')"
                    />
                    <div class="indicator">
                        <img v-if="usernameState === VIEW_STATE.SUCCESS" src="@/assets/icons/check/check.svg" />
                        <img v-if="usernameState === VIEW_STATE.FAILURE" src="@/assets/icons/xmark/xmark.red.svg" />
                        <div v-if="usernameState === VIEW_STATE.LOADING" class="spinner" />
                    </div>
                </div>
                <p class="hint">{{ t('auth.completeProfile.usernameHint') }}</p>
            </div>

            <!-- Sports Selection -->
            <div id="sports-section">
                <h3>{{ t('auth.completeProfile.selectInterests') }}</h3>
                <p class="hint">{{ t('auth.completeProfile.interestsHint') }}</p>

                <div id="sports-list">
                    <li
                        v-for="sport in session.sports"
                        :key="sport.name"
                        :class="{ sport: true, selected: isSelected(sport) }"
                        @click="toggleSport(sport)"
                    >
                        {{ sport.name }}
                    </li>
                </div>
            </div>

            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

            <div id="action-row">
                <button id="continue-button" :disabled="props.loading" @click="handleSubmit">
                    <div v-if="props.loading" class="button-spinner" />
                    <span v-else>{{ t('auth.completeProfile.continue') }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { VIEW_STATE } from '~/data/Enums';
import { Sport } from '~/data/models/GenericModels';
import { useSessionStore } from '~/stores/session-store';
import { UserService } from '~/data/services/UserService';

const { t } = useI18n();
const props = defineProps<{
    initialFullName?: string
    initialEmail?: string
    loading?: boolean
}>();

const emits = defineEmits(['submit']);

const session = useSessionStore();
const userService = new UserService();

const fullName = ref(props.initialFullName ?? '');
const email = ref(props.initialEmail ?? '');
const username = ref('');
const selectedSports = ref<Sport[]>([]);
const errorMessage = ref('');
const usernameState = ref<VIEW_STATE>(VIEW_STATE.PENDING);

// Debounced username availability check
let isInitialRun = true;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(username, (newValue) => {
    if (isInitialRun) {
        isInitialRun = false;
        return;
    }

    if (newValue !== '') {
        if (debounceTimer !== null) {
            clearTimeout(debounceTimer);
        }
        debounceTimer = setTimeout(() => {
            checkUsernameAvailability()
                .catch(() => { usernameState.value = VIEW_STATE.FAILURE; })
                .then(() => { debounceTimer = null; });
        }, 250);
    } else {
        if (debounceTimer !== null) {
            clearTimeout(debounceTimer);
        }
        usernameState.value = VIEW_STATE.PENDING;
    }
});

async function checkUsernameAvailability() {
    usernameState.value = VIEW_STATE.LOADING;
    const isAvailable = await userService.usernameAvailability(username.value);
    usernameState.value = isAvailable ? VIEW_STATE.SUCCESS : VIEW_STATE.FAILURE;
}

function isSelected(sport: Sport): boolean {
    return selectedSports.value.some(s => s.name === sport.name);
}

function toggleSport(sport: Sport) {
    const index = selectedSports.value.findIndex(s => s.name === sport.name);
    if (index !== -1) {
        selectedSports.value.splice(index, 1);
    } else {
        selectedSports.value.push(sport);
    }
}

function handleSubmit() {
    errorMessage.value = '';

    if (!fullName.value.trim()) {
        errorMessage.value = t('auth.completeProfile.errorFullName');
        return;
    }
    if (!email.value.trim()) {
        errorMessage.value = t('auth.completeProfile.errorEmail');
        return;
    }
    if (!username.value.trim() || usernameState.value !== VIEW_STATE.SUCCESS) {
        errorMessage.value = t('auth.completeProfile.errorUsername');
        return;
    }
    if (selectedSports.value.length === 0) {
        errorMessage.value = t('auth.completeProfile.errorSports');
        return;
    }

    const nameParts = fullName.value.trim().split(' ');
    emits('submit', {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: email.value.trim(),
        username: username.value.trim(),
        sports: selectedSports.value,
    });
}
</script>

<style scoped>
#complete-profile {
    width: 100%;
    height: 100%;
    display: flex;
    overflow-y: auto;
    align-items: center;
    justify-content: center;
    padding-top: 6rem;
    background-color: var(--secondary-background-color);
}

#content {
    width: 100%;
    max-width: 35rem;
    padding: 3rem 2rem;

    .icon {
        width: 3rem;
        height: 2.5rem;
        margin-bottom: 1rem;
    }

    /* Show dark logo in light mode, white logo in dark mode */
    .logo-light { display: none; }
    .logo-dark { display: block; }

    @media (prefers-color-scheme: dark) {
        .logo-light { display: block; }
        .logo-dark { display: none; }
    }

    h1 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.25rem;
        color: var(--primary-label-color);
    }

    .subtitle {
        font-size: 0.9rem;
        margin-bottom: 2rem;
        color: var(--secondary-label-color);
    }
}

.field {
    margin-bottom: 1.5rem;

    h3 {
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--primary-label-color);
    }

    input {
        width: 100%;
        height: 2.75rem;
        border: unset;
        font-size: 1rem;
        border-radius: 8px;
        padding: 0rem 1rem;
        color: var(--primary-label-color);
        background-color: var(--tertiary-background-color);
    }

    .input-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        input {
            flex: 1;
        }

        .indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2.75rem;
            height: 2.75rem;
            border-radius: 8px;
            background-color: var(--tertiary-background-color);

            img {
                width: 1.25rem;
                height: 1.25rem;
            }

            .spinner {
                border: 0.2rem solid #f3f3f3;
                border-top: 0.2rem solid var(--primary-brand-color);
                border-radius: 50%;
                width: 1.25rem;
                height: 1.25rem;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        }
    }

    .hint {
        color: var(--secondary-label-color);
        font-size: 0.75rem;
        margin-top: 0.25rem;
    }
}

#sports-section {
    margin-bottom: 1.5rem;

    h3 {
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
        color: var(--primary-label-color);
    }

    .hint {
        color: var(--secondary-label-color);
        font-size: 0.75rem;
        margin-bottom: 0.75rem;
    }

    #sports-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        padding: 0;
        max-height: 10rem;
        overflow-y: auto;
        list-style-type: none;

        .sport {
            display: flex;
            cursor: pointer;
            align-items: center;
            border-radius: 20px;
            white-space: nowrap;
            padding: 0.4rem 0.85rem;
            font-size: 0.85rem;
            text-transform: capitalize;
            color: var(--primary-label-color);
            border: var(--component-border) solid 1px;
            background-color: var(--tertiary-background-color);
            transition: border-color 0.15s ease;
        }

        .selected {
            border-color: var(--secondary-brand-color);
        }
    }
}

.error {
    color: #e74c3c;
    font-size: 0.8rem;
    margin-bottom: 1rem;
}

#action-row {
    display: flex;
    justify-content: flex-end;

    #continue-button {
        height: 2.75rem;
        color: white;
        display: flex;
        border: unset;
        cursor: pointer;
        font-weight: 500;
        font-size: 0.95rem;
        border-radius: 25px;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 2rem;
        background-color: var(--primary-brand-color);
        transition: opacity 0.15s ease;

        &:disabled {
            cursor: not-allowed;
            opacity: 0.6;
        }

        .button-spinner {
            border: 0.15rem solid rgba(255, 255, 255, 0.3);
            border-top: 0.15rem solid white;
            border-radius: 50%;
            width: 1.1rem;
            height: 1.1rem;
            animation: spin 1s linear infinite;
        }
    }

    @media (prefers-color-scheme: dark) {
        #continue-button {
            color: black;
            background-color: white;

            .button-spinner {
                border-color: rgba(0, 0, 0, 0.3);
                border-top-color: black;
            }
        }
    }
}
</style>
