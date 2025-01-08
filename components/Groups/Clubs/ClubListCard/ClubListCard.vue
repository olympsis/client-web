<template>
    <div id="club-list-container">
        
        <!-- Picture & Header -->
        <div id="club-header">
            <img :src="imageURL" v-if="!imageFailed && imageURL !== undefined" @error="imageFailed = true">
            <picture id="default-img" v-if="imageFailed || imageURL === undefined">
                <source srcset="@assets/icons/group/group.fill.white.svg" media="(prefers-color-scheme: dark)">
                <img src="@assets/icons/group/group.fill.svg">
            </picture>
            <div id="club-info">
                <h1>{{ name }}</h1>
                <h2>{{ location }}</h2>
            </div>
        </div>

        <!-- Tags -->
        <div id="club-tags">
            <div class="tag" v-for="tag in tags">{{ tag }}</div>
        </div>

        <!-- Body -->
        <div id="club-body">{{ body }}</div>

        <!-- Actions -->
        <div id="club-actions">
            <div class="details-button" @click="navigateToClubDetails"> View Details </div>
            <TextButton text="Apply" success-text="Applied" failure-text="Failed" v-model="buttonState" @click="apply"/>
        </div>

        <!-- Club Detail Card -->
        <Dialog
            v-model:visible="showClubDetail"
            blockScroll
            position="center"
            :style="{'height': '80vh', 'overflow-y': 'scroll'}" 
            :pt="{
                root: {
                    style: {
                        width: '100%',
                        'max-width': '35rem'
                    }
                }
            }"
        >
            <template #container="{ closeCallback }">
                <ClubDetailsCard :club="club" @close="closeCallback"/>
            </template>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { VIEW_STATE } from '~/data/Enums';
import { Club } from '~/data/models/ClubModels';
import { generateImageURL } from '~/utils/Image';
import { useSessionStore } from '~/stores/session-store';

import Dialog from 'primevue/dialog';
import ClubDetailsCard from '../ClubDetailsCard/ClubDetailsCard.vue';
import TextButton from '@/components/Buttons/LoadingButtons/TextButton/TextButton.vue';

const props = defineProps({
    club: { type: Club, required: true }
});

const router = useRouter();
const session = useSessionStore();

const imageFailed = ref(false);
const showClubDetail = ref(false);
const buttonState = ref(VIEW_STATE.PENDING);

const imageURL = computed(() => {
    if (props.club.logo) {
        return generateImageURL(props.club.logo);
    }
    return undefined;
});

const name = computed(() => {
    return props.club.name;
});

const location = computed(() => {
    return `${props.club.city}, ${props.club.state}`;
});

const tags = computed(() => {
    return props.club.sports ?? [];
});

const body = computed(() => {
    return props.club.description;
});

function navigateToClubDetails() {
    if (!props.club.id) return;
    router.push(`/groups/detail/${props.club.id}`);
}

function apply() {
    if (props.club.id && buttonState.value !== VIEW_STATE.LOADING && buttonState.value !== VIEW_STATE.SUCCESS) {
        buttonState.value = VIEW_STATE.LOADING;
        session.clubService.applyToClub(props.club.id)
            .then((hasApplied: boolean) => {
                if (hasApplied) {
                    buttonState.value = VIEW_STATE.SUCCESS;
                } else {
                    buttonState.value = VIEW_STATE.FAILED;
                }
            })
            .catch(() => {
                buttonState.value = VIEW_STATE.FAILED;
            });
    }
}
</script>

<style scoped>
#club-list-container {
    max-width: 30rem;
    padding: 1rem;
    border-radius: var(--card-border-radius);
    background-color: var(--secondary-background-color);

    #club-header {
        display: flex;

        img {
            width: 6rem;
            height: 6rem;
            border-radius: 10px;
        }

        #default-img {
            width: 6rem;
            height: 6rem;
            display: flex;
            border-radius: 10px;
            align-items: center;
            justify-content: center;
            background-color: var(--tertiary-background-color);

            img {
                width: 3rem;
                height: 3rem;
            }
        }

        #club-info {
            margin: 0rem 1rem;
            h1 {
                font-size: 1.3rem;
                color: var(--primary-label-color);
            }
            h2 {
                color: gray;
                font-size: 1rem;
                margin-top: 0.2rem;
                font-weight: normal;
            }
        }
    }

    #club-tags {
        display: flex;
        margin: 1rem 0rem;
        overflow-x: scroll;

        .tag {
            width: fit-content;
            border-radius: 10px;
            padding: 0.2rem 1rem;
            margin: 0rem 0.5rem;
            text-transform: capitalize;
            color: var(--primary-label-color);
            background-color: var(--tertiary-background-color);
        }
    }

    #club-body {
        margin: 1rem 0rem;
        color: var(--primary-label-color);
    }

    #club-actions {
        display: flex;
        margin: 1rem 0rem 0.5rem 0rem;

        .details-button {
            width: 100%;
            display: flex;
            cursor: pointer;
            margin-right: 0.5rem;
            align-items: center;
            border-radius: 10px;
            padding: 0.5rem 0rem;
            justify-content: center;
            color: var(--primary-label-color);
            background-color: var(--tertiary-background-color);
        }

        .apply-button {
            width: 100%;
            display: flex;
            color: white;
            cursor: pointer;
            margin-left: 0.5rem;
            align-items: center;
            border-radius: 10px;
            padding: 0.5rem 0rem;
            justify-content: center;
            background-color: var(--primary-brand-color);
        }
    }
}
</style>