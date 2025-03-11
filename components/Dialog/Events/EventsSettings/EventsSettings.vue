<template>
    <div id="event-settings-dialog" class="popup">
        <div class="header">
            <button class="secondary button centered" @click="$emit('close')">
                <picture>
                    <source srcset="@/assets/icons/xmark/xmark.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/xmark/xmark.svg">
                </picture>
            </button>

            <div class="title">
                Events Settings
            </div>

            <button class="primary button" @click="handleUpdateSettings">
                Update
            </button>
        </div>

        <div class="body">
            <div class="section">
                <div class="header">Radius (Miles)</div>
                <div class="sub-header">Search Radius from your location</div>
                <div id="radius">
                    <Slider v-model="radius" :step="5" :max="300" :style="{ width: '100%' }"/>
                    <div class="label">{{ radius }} Miles</div>
                </div>
            </div>

            <div class="section">
                <div class="header">Selected Sports</div>
                <div class="sub-header">The sports to include in your search</div>
                <MultiSportsPicker v-model:model-value="selectedSports" :multi-select="true"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { SPORTS } from '~/data/Enums';
import Slider from 'primevue/slider';
import MultiSportsPicker from '~/components/MultiSportsPicker/MultiSportsPicker.vue';

const session = useSessionStore();

const radius = ref<number>(40);
const selectedSports = ref<SPORTS[]>([]);
const emit = defineEmits(['update', 'close']);

function handleUpdateSettings() {
    emit('update', {
        radius: radius.value,
        sports: selectedSports 
    });
}

onMounted(() => {
    const user = session.user;
    if (!user) return;
    selectedSports.value = user.sports;
});

</script>

<style scoped>
#event-settings-dialog {
    padding: 1rem;
    max-width: 32rem;
    border-radius: 20px;
}
.body {
    margin: 1rem;
    flex-direction: column;
}

#radius {
    display: flex;
    align-items: center;

    .label {
        border: unset;
        margin-left: 1rem;
        font-size: 0.8rem;
        font-weight: bold;
        white-space: nowrap;
        border-radius: 10px;
        padding: 0.5rem;
        background-color: var(--secondary-background-color);
    }
}
</style>