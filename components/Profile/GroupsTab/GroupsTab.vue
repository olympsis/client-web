<template>
    <div id="groups-tab">
        <div v-if="clubs.length > 0" id="clubs" class="section">
            <h2>Clubs</h2>
            <ul class="list">
                <ClubListCard v-for="club in clubs" :club="club" :is-member="true" class="card"/>
            </ul>
        </div>

        <div v-if="organizations.length > 0" id="orgs" class="section">
            <h2>Organizations</h2>
            <ul class="list">

            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Club } from '~/data/models/ClubModels';
import { Organization } from '~/data/models/OrganizationModels';
import ClubListCard from '~/components/Groups/Clubs/ClubListCard/ClubListCard.vue';

defineProps({
    clubs: { type: Array<Club>, required: true },
    organizations: { type: Array<Organization>, required: true }
});
</script>

<style scoped>
#groups-tab {
    .section {
        width: 100%;
        display: flex;
        margin: 1rem 0rem;
        flex-direction: column;
    }

    .list {
        gap: 1rem;
        width: 100%;
        display: grid;
        min-height: 10rem;
        overflow-y: scroll;
        padding: 1rem 0rem;
        align-items: center;
        grid-auto-flow: column;
        justify-content: center;
        grid-template-columns: repeat(auto-fill,minmax(1fr,1fr));
    }

    .card {
        min-width: 20rem;
    }
}
</style>