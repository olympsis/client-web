<template>
    <li id="club-list-card">
        
        <!-- Picture & Header -->
        <div id="club-header">
            <img :src="imageURL" v-if="!imageFailed && imageURL !== undefined" @error="imageFailed = true">
            <div id="default-img" v-if="imageFailed || imageURL === undefined">
                <picture id="default-img" >
                    <source srcset="@/assets/icons/group/group.fill.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/group/group.fill.svg">
                </picture>
            </div>

            <ul id="sports">
                <SportLabel v-for="sport in club.sports" :sport="sport"/>
            </ul>
        </div>

        <!-- Tags -->
        <!-- <div id="club-tags">
            <div class="tag" v-for="tag in tags">{{ tag }}</div>
        </div> -->

        <!-- Body -->
        <div id="club-body">
            <div id="club-info">
                <h4>{{ name }}</h4>
                <div id="location">
                    <picture :style="{ height: '1rem', width: '1rem', marginRight: '0.25rem' }">
                        <source srcset="@/assets/icons/pin-drop/pin.drop.white.svg" media="(prefers-color-scheme: dark)"> 
                        <img class="location-pin" src="@/assets/icons/pin-drop/pin.drop.svg"> 
                    </picture>
                    <div id="location-name">{{ club.city + ', ' + club.state }}</div>
                </div>
            </div>
            <div id="body">{{ body }}</div>
        </div>

        <!-- Actions -->
        <div id="club-actions" v-if="!isMember">
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
    </li>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { VIEW_STATE } from '~/data/Enums';
import { Club } from '~/data/models/ClubModels';
import { generateImageURL } from '~/utils/image-helpers';
import { useSessionStore } from '~/stores/session-store';

import Dialog from 'primevue/dialog';
import SportLabel from '~/components/SportLabel/SportLabel.vue';
import ClubDetailsCard from '../ClubDetailsCard/ClubDetailsCard.vue';
import TextButton from '@/components/Buttons/LoadingButtons/TextButton/TextButton.vue';

const props = defineProps({
    club: { type: Club, required: true },
    isMember: { type: Boolean, default: false }
});

const router = useRouter();
const session = useSessionStore();

const imageFailed = ref(false);
const showClubDetail = ref(false);
const buttonState = ref(VIEW_STATE.PENDING);

const imageURL = computed(() => {
    if (props.club.banner) {
        return generateImageURL(props.club.banner);
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
    router.push(`/groups/search/${props.club.id}`);
}

function apply() {
    if (props.club.id && buttonState.value !== VIEW_STATE.LOADING && buttonState.value !== VIEW_STATE.SUCCESS) {
        buttonState.value = VIEW_STATE.LOADING;
        session.clubService.applyToClub(props.club.id)
            .then((hasApplied: boolean) => {
                if (hasApplied) {
                    buttonState.value = VIEW_STATE.SUCCESS;
                } else {
                    buttonState.value = VIEW_STATE.FAILURE;
                }
            })
            .catch(() => {
                buttonState.value = VIEW_STATE.FAILURE;
            });
    }
}
</script>

<style scoped>
#club-list-card {
    height: 100%;
    max-width: 30rem;
    list-style-type: none;
    border-radius: var(--card-border-radius);
    background-color: var(--secondary-background-color);

    @media (max-width: 940px) {
        width: calc(100vw - 1rem);
    }

    #body {
        height: 5rem;
        overflow-y: scroll;
    }

    #club-header {
        display: flex;
        position: relative;

        img {
            width: 100%;
            height: 9rem;
            border-radius: 10px 10px 0px 0px;
        }

        #default-img {
            width: 100%;
            height: 9rem;
            display: flex;
            border-radius: 10px 10px 0px 0px;
            align-items: center;
            justify-content: center;
            background-color: var(--olympsis-gray);

            img {
                width: 3rem;
                height: 3rem;
            }
        }

        #sports {
            padding: 0;
            gap: 0.5rem;
            display: flex;
            margin: 0.5rem;
            position: absolute;
            flex-direction: row;
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
        margin: 1rem;
        color: var(--primary-label-color);
    }

    #club-actions {
        display: flex;
        padding: 1rem;

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

#club-info {
    margin-bottom: 1rem;
}

#location {
    opacity: 0.5;
    display: flex;
    font-size: 0.95rem;
    align-items: center;
    margin: 0.25rem 0rem;

    .location-pin {
        width: 1rem;
        height: 1rem;
    }
}
</style>