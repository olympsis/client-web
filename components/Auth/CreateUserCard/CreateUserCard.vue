<template>
    <div id="create-user-card">
        <h1> Getting to know you </h1>
        <h2>
            What's your handle? Favorite sports?
        </h2>
        
        <div class="username">
            <h3>Username</h3>
            <div class="input-wrapper">
                <input type="text" id="username" autocomplete="off" autofocus v-model="username"/>
                <div class="indicator">
                    <img v-if="state == VIEW_STATE.SUCCESS" src="@/assets/icons/check/check.svg">
                    <img v-if="state == VIEW_STATE.FAILURE"src="@/assets/icons/xmark/xmark.red.svg">
                    <div v-if="state == VIEW_STATE.LOADING" class="spinner" />
                </div>
            </div>
            <p>Must be between 5 and 15 characters and contain no special characters to be valid</p>
        </div>

        <div id="sports-section">
            <h3>Favorite Sports</h3>
            <p>The sports you like to play or learning to play</p>

            <div id="list">
                <SportIconLabel v-for="sport in SPORTS" :sport="sport" @click="handleSelectedSport(sport)" :is-selected="selectedSports.find((s) => { return s == sport }) != null"/>
            </div>
            
        </div>

        <button id="action-button" @click="completeAccountCreation"> 
            <TextButton text="Continue" success-text="Success" failure-text="Failed" :model-value="model" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, watch } from 'vue';
import { SPORTS, VIEW_STATE } from '@/data/Enums';
import { useSessionStore } from '@/stores/session-store';
import { UserService } from '~/data/services/UserService';

import SportIconLabel from '@/components/SportIconLabel/SportIconLabel.vue';
import TextButton from '@/components/Buttons/LoadingButtons/TextButton/TextButton.vue';

const session = useSessionStore();
const service = new UserService();
const emits = defineEmits([ 'submit' ]);
const model = defineModel('state', { default: VIEW_STATE.PENDING });

const username: Ref<string> = ref('');
const selectedSports: Ref<SPORTS[]> = ref([]);
const state: Ref<VIEW_STATE> = ref(VIEW_STATE.PENDING);

let isInitialRun = true;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(username, (newValue, _) => {
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
                .catch(() => {
                    state.value = VIEW_STATE.FAILURE;
                })
                .then(() => {
                    debounceTimer = null;
                });
            }, 500);
    } else {
        if (debounceTimer !== null) {
            clearTimeout(debounceTimer);
        }
        state.value = VIEW_STATE.FAILURE;
    }
});

function handleSelectedSport(sport: any) {
    const index = selectedSports.value.findIndex((s) => {
        return s == sport;
    });

    if (index != -1) {
        selectedSports.value.splice(index, 1);
    } else {
        selectedSports.value.push(sport);
    }   
}

async function checkUsernameAvailability() {
    state.value = VIEW_STATE.LOADING;

    const isAvailable = await service.usernameAvailability(username.value)
    if (isAvailable) {
        state.value = VIEW_STATE.SUCCESS;
    } else {
        state.value = VIEW_STATE.FAILURE;
    }
}

function completeAccountCreation() {
    if (username.value != '' && state.value == VIEW_STATE.SUCCESS && selectedSports.value.length > 0) {
        emits('submit', { username: username.value, sports: selectedSports.value });
    }
}

</script>

<style scoped>
#create-user-card {
    margin: auto;
    display: flex;
    max-width: 25rem;
    padding: 2rem 2rem;
    align-items: center;
    border-radius: 10px;
    flex-direction: column;
    background-color: var(--secondary-background-color);

    h1 {
        color: white;
        font-size: 1rem;
        text-align: center;
        margin: 0.5rem 0rem;
        color: var(--primary-label-color);
    }

    h2 {
        color: white;
        font-size: 0.8em;
        text-align: center;
        font-weight: normal;
        margin-bottom: 1rem;
        color: var(--primary-label-color);
    }

    .username {
        h3 {
            font-size: 0.9rem;
            font-weight: normal;
            color: var(--primary-label-color);
        }

        input {
            width: 100%;
            height: 2rem;
            border: unset;
            font-size: 1rem;
            border-radius: 5px;
            margin: 0.25rem 0rem;
            padding: 0rem 0.5rem;
            color: var(--primary-label-color);
            background-color: var(--tertiary-background-color);
        }

        .input-wrapper {
            display: flex;
            align-items: center;

            .indicator {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 3rem;
                height: 2rem;
                margin: 0rem 1rem;
                border-radius: 5px;
                background-color: var(--tertiary-background-color);

                .spinner {
                    border: 0.25rem solid #f3f3f3;
                    border-top: 0.25rem solid var(--primary-brand-color);
                    border-radius: 50%;
                    width: 1.5rem;
                    height: 1.5rem;
                    animation: spin 2s linear infinite;
                    -webkit-animation: spin 2s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @-webkit-keyframes spin {
                    0% { -webkit-transform: rotate(0deg); }
                    100% { -webkit-transform: rotate(360deg); }
                }
            }
        }

        p {
            color: gray;
            font-size: 0.7rem;
        }
    }

    #sports-section {
        width: 100%;
        display: flex;
        margin: 1rem 0rem;
        flex-direction: column;

        h3 {
            font-size: 0.9rem;
            font-weight: normal;
            color: var(--primary-label-color);
        }

        p {
            color: gray;
            font-size: 0.7rem;
            margin: 0.2rem 0rem;
        }

        #list {
            display: flex;
            height: 10rem;
            flex-wrap: wrap;
            margin: 1rem 0rem;
            overflow-y: scroll;
            justify-content: center;
        }
    }

    #action-button {
        height: 2.5rem;
        color: white;
        display: flex;
        border: unset;
        cursor: pointer;
        border-radius: 5px;
        font-style: italic;
        border-color: unset;
        align-items: center;
        padding: 0.5rem 1rem;
        text-transform: uppercase;
        background-color: var(--primary-brand-color);
    }
}

@media (max-width: 25rem) {
    #create-user-card {
        border-radius: unset;
    }
}
</style>