<template>
    <div id="event-participants-settings" class="popup">
        <div class="header">
            <button class="secondary button" @click="$emit('close')">
                Cancel
            </button>

            <div class="title">
                Limit Participants
            </div>

            <button class="primary button" @click="$emit('done', { min, max, hasWaitlist })">
                Done
            </button>
        </div>

        <div id="body" class="body">
            <div class="section">
                <div class="header">
                    Min Participants
                </div>
                <div class="sub-header">
                    Number of participants needed to run the event.
                </div>

                <div id="input" class="participants-slider">
                    <Slider v-model="min" :style="{ width: '100%' }"/>
                    <input type="number" v-model="min"/>
                </div>
            </div>

            <div class="section">
                <div class="header">
                    Max Participants
                </div>
                <div class="sub-header">
                    Limits the event spots. Automatically adds a waitlist.
                </div>

                <div id="input" class="participants-slider">
                    <Slider v-model="max" :step="5" :style="{ width: '100%' }"/>
                    <input type="number" v-model="max"/>
                </div>
            </div>

            <div class="section">
                <div class="header">
                    Add a Waitlist
                </div>
                <div class="sub-header">
                    Allow extra participants to join if spots open up.
                </div>

                <div id="input" :style="{marginTop: '0.5rem'}">
                    <ToggleSwitch v-model="hasWaitlist"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Slider from 'primevue/slider';
import ToggleSwitch from 'primevue/toggleswitch';

const min = ref<number>(0);
const max = ref<number>(0);
const hasWaitlist = ref<boolean>(false);
</script>

<style scoped>
#event-participants-settings {
    width: 100%;
    padding: 1rem;
}

#body {
    flex-direction: column;
}

.participants-slider {
    display: flex;
    align-items: center;
    margin: 0rem 0.5rem;

    input {
        width: 5rem;
        height: 2rem;
        font-size: 1rem;
        margin-top: 0.5rem;
        margin-left: 2rem;
    }
}
</style>