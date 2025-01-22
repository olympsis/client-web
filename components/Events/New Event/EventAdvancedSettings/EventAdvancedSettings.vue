<template>
    <div id="event-advanced-settings" class="popup">
        <div class="header">
            <button class="secondary button" @click="$emit('close')">
                Cancel
            </button>

            <div class="title">
                Advanced Event Settings
            </div>
        </div>
        <div id="body" class="body">
            <PersonMenuButton text="Limit Event Spots" @click="$emit('participants')" />
            <NorthEastMenuButton text="Add an External Link" @click="$emit('link')" />
            <ClockMenuButton text="Set up a Recurring Event" @click="$emit('recurrence')" />
        </div>
    </div>
</template>

<script setup lang="ts">
import ClockMenuButton from '~/components/Buttons/MenuButton/ClockMenuButton.vue';
import PersonMenuButton from '~/components/Buttons/MenuButton/PersonMenuButton.vue';
import NorthEastMenuButton from '~/components/Buttons/MenuButton/NorthEastMenuButton.vue';
</script>

<style scoped>
#event-advanced-settings {
    width: 100%;
    padding: 1rem;

    #body {
        margin-top: 1rem;
        padding: 0.5rem 0rem;
        flex-direction: column;

        div {
            margin: 0.25rem 1rem;
        }
    }
}
</style>