<template>
    <div id="quick-actions">
        <NuxtLink id="events" class="action" to="/events">
            <div id="body">
                <h2 id="header">Lookup Events</h2>
                <div id="sub-header">Explore venues, games and what’s happening near you. Get out play and touch some grass!</div>
            </div>
            <img class="icon" src="@/assets/icons/map/map.fill.svg">
        </NuxtLink>
        <NuxtLink id="groups" class="action" to="/groups/search">
            <div id="body">
                <h2 id="header">Search Groups</h2>
                <div id="sub-header">Explore groups, connect with like minded people. Get out play and have some fun!</div>
            </div>
            <picture>
                <img class="icon" src="@/assets/icons/group/group.svg">
            </picture>
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
#quick-actions {
    display: flex;
    flex-direction: column;

    .action {
        display: flex;
        border: unset;
        cursor: pointer;
        align-items: center;
        padding: 0.5rem 0rem;
        margin: 0.25rem 0rem;
        border-radius: 0.5rem;

        #body {
            display: flex;
            text-align: left;
            margin: 0rem 1rem;
            flex-direction: column;
            padding-bottom: 0.25rem;

            #header {
                font-family: 'Archivo';
            }
        }
    }

    #events {
        color: white;
        background-color: var(--primary-brand-color);
    }

    #groups {
        color: black;
        background-color: #F4F4F7;
    }

    .icon {
        width: 2rem;
        height: 2rem;
        margin: 0rem 1rem;
    }
}
</style>