<template>
    <div id="event-advanced-settings">
        <div id="header">
            <button id="cancel" @click="$emit('close')">
                Cancel
            </button>

            <div id="title">
                Advanced Event Settings
            </div>
        </div>
        <div id="settings">
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
    background-color: var(--primary-background-color);

    #header {
        display: flex;
        align-items: center;

        #cancel {
            border: unset;
            cursor: pointer;
            border-radius: 10px;
            padding: 0.5rem 1rem;
            background-color: var(--secondary-background-color);

            &:hover {
                transform: scale(1.1);
            }
        }

        #title {
            margin: 0 auto;
            color: var(--primary-label-color);
        }
    }

    #settings {
        margin-top: 1rem;
        padding: 0.5rem 0rem;

        #menu-button {
            margin: 0.5rem 1rem;
        }
    }
}
</style>