<template>
    <div id="club-application-card">
        <div id="application-top">
            <UserIcon :user="applicant" :size="5"/>
            <div id="application-user-info">
                <h1>{{ applicantName ?? 'Olympsis User' }}</h1>
                <h2>{{ applicant?.username ?? 'olympsis-user' }}</h2>
            </div>
        </div>

        <div id="application-body">{{ applicationBody }}</div>

        <div id="application-actions">
            <button id="deny" @click="handleApplicationResponse('denied')"> Deny </button>
            <TextButton text="Approve" success-text="Approved" failure-text="Failed" v-model="buttonState" @click="handleApplicationResponse('accepted')"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { VIEW_STATE } from '~/data/Enums';
import { UserData} from '@/data/models/UserModels';
import { computed, type ComputedRef, ref, type Ref } from 'vue';
import { useSessionStore } from '@/stores/session-store';
import { ClubApplication, ClubApplicationDao } from '@/data/models/ClubModels';

import * as Sentry from "@sentry/nuxt";
import UserIcon from '@/components/UserIcon/UserIcon.vue';
import TextButton from '@/components/Buttons/LoadingButtons/TextButton/TextButton.vue';

const props = defineProps({
    application: ClubApplication
});

const session = useSessionStore();
const emit = defineEmits(['answered']);
const buttonState: Ref<VIEW_STATE> = ref(VIEW_STATE.PENDING);

const applicant: ComputedRef<UserData | undefined> = computed(() => {
   return props.application?.applicant; 
});

const applicantName: ComputedRef<string | null> = computed(() => {
    if (applicant.value?.firstName && applicant.value.lastName) {
        return `${applicant.value?.firstName, applicant.value?.lastName}`;
    } else {
        return null;
    }
});

const applicationBody: ComputedRef<string> = computed(() => {
    return applicant.value?.bio ?? '...';
});

function handleApplicationResponse(status: string) {
    const selectedGroupID = session.selectedGroup?.club?.id ?? session.selectedGroup?.organization?.id;
    if (props.application?.id && selectedGroupID) {
        buttonState.value = VIEW_STATE.LOADING;
        const dao = new ClubApplicationDao(undefined, selectedGroupID, status);
        session.clubService.modifyApplication(props.application.id, selectedGroupID, dao)
            .then((modified) => {
                if (modified) {
                    if (props.application?.status) {
                        props.application.status = status;
                    }
                    buttonState.value = VIEW_STATE.SUCCESS;
                    emit('answered', { id: props.application?.id });
                } else {
                    buttonState.value = VIEW_STATE.FAILURE;
                    
                    setTimeout(() => {
                        buttonState.value = VIEW_STATE.PENDING;
                    }, 500);
                }
            })
            .catch((error) => {
                Sentry.captureException(error);
                buttonState.value = VIEW_STATE.FAILURE;
            });
    } else {
        console.error('Failed to find application ID or the selected group ID.');
    }
}

</script>

<style scoped>
#club-application-card {
    padding: 1rem;
    max-width: 30rem;
    border-radius: var(--card-border-radius);
    background-color: var(--secondary-background-color);

    #application-top {
        display: flex;
        flex-direction: row;

        #application-user-info {
            margin: 1rem;

            h1 {
                font-size: 1.5rem;
                color: var(--primary-label-color);
            }

            h2 {
                color: gray;
                font-size: 1rem;
                font-weight: 400;
            }
        }
    }

    #application-body {
        text-align: left;
        margin-top: 1rem;
        color: var(--primary-label-color);
    }

    #application-actions {
        display: flex;
        margin-top: 1rem;
        flex-direction: row;

        * {
            margin: 0.5rem;
        }

        #deny {
            width: 100%;
            border: unset;
            cursor: pointer;
            font-size: 1rem;
            text-align: center;
            color: var(--primary-label-color);
            background-color: var(--tertiary-background-color);
            border-radius: var(--button-border-radius);
        }
    }
}
</style>