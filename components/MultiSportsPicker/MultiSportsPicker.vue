<template>
    <div id="event-sports-picker">
        <div v-for="sport in SPORTS">
            <SportIconLabel :sport="sport" :class="{ selected: model.find((s) => s == sport) !== undefined }" @click="handleSelectedSport(sport)"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { SPORTS } from '@/data/Enums';
import SportIconLabel from '@/components/SportIconLabel/SportIconLabel.vue';

const props = defineProps({ 
    multiSelect: { type: Boolean, default: false } 
});
const model = defineModel({ 
    default: [ SPORTS.RUNNING ] 
});

function handleSelectedSport(sport: SPORTS) {
    if (props.multiSelect) {
        const index = model.value.findIndex((s) => s === sport)
        if (index !== -1) {
            model.value.splice(index, 1);
        } else {
            model.value.push(sport);
        }
    } else {
        model.value = [sport];
    }
}
</script>

<style scoped>
#event-sports-picker {
    display: flex;
    overflow-y: scroll;
}
</style>