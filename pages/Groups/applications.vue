<template>
    <NavigationBar/>
    <main id="group-applications-view">
        
        <!-- Header -->
        <div id="header">
            <button @click="router.push('/groups/settings')">
                <picture>
                    <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/chevron/chevron.left.svg"
                </picture>
            </button>

            <h1> Applications </h1>
        </div>
        
        <ul id="applications-list">
            <li v-if="selectedGroupType === GROUP_TYPE.CLUB" v-for="application in filteredClubApplication">
                <ClubApplicationCard :application="application"/>
            </li>
            <li v-else v-for="application in organizationApplications">{{ application.id }}</li>
            <div id="no-applications" v-if="filteredClubApplication.length == 0">
                No Applications Found
            </div>
        </ul>
    </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { GROUP_TYPE } from '@/data/Enums';
import { useSessionStore } from '@/stores/session-store';
import { ClubApplication } from '@/data/models/ClubModels';
import { GroupSelection } from '@/data/models/GenericModels';
import { computed, type ComputedRef, ref, type Ref } from 'vue';

import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
import ClubApplicationCard from '@/components/Groups/Clubs/ClubApplicationCard/ClubApplicationCard.vue';

const router = useRouter();
const session = useSessionStore();

const clubApplications: Ref<Array<ClubApplication>> = ref([]);
const organizationApplications: Ref<Array<any>> = ref([]);

const filteredClubApplication: ComputedRef<Array<ClubApplication>> = computed(() => {
    return clubApplications.value
        .filter((a) => {
            return a.status === 'pending';
        });
});

const selectedGroup: ComputedRef<GroupSelection | undefined> = computed(() => {
    return session.selectedGroup;
});

const selectedGroupType: ComputedRef<GROUP_TYPE> = computed(() => {
    return selectedGroup.value?.type ?? GROUP_TYPE.CLUB;
});

async function fetchApplications() {
    if (selectedGroup.value) {
        switch (selectedGroupType.value) {
            case GROUP_TYPE.CLUB:
                const id = selectedGroup.value.club?.id;
                if (id) {
                    const response = await session.clubService.getApplicationRequests(id);
                    clubApplications.value = response?.applications ?? [];
                }
            case GROUP_TYPE.ORGANIZATION:
                break;
        }
    }
}

fetchApplications();

</script>

<style scoped>
#group-applications-view {
    width: 100%;
    display: flex;
    margin: 0 auto;
    overflow-y: scroll;
    align-items: center;
    flex-direction: column;

    #header {
        
        width: 100%;
        display: flex;
        max-width: 25rem;
        margin: 1rem 0rem;
        grid-area: header;
        flex-direction: row;
        align-items: center;

        .button {
            margin: 0rem 1rem;

            picture {
                width: 100%;
                height: 100%;
            }
        }

        button {
            all: unset;
            cursor: pointer;
        }

        h1 {
            margin: auto;
            max-width: 40vw;
            overflow: hidden;
            font-size: 1.2rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: var(--primary-label-color);
        }
    }

    #applications-list {
        padding: 0;
        width: 100%;
        max-width: 25rem;
        list-style-type: none;

        li {
            margin: 0.5rem 0rem;
        }

        #no-applications {
            width: 100%;
            height: 10rem;
            text-align: center;
            margin-top: 5rem;
        }
    }
}
</style>