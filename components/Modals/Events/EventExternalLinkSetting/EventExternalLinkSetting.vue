<template>
    <div id="event-external-link-setting" class="settings-view">
        <div id="header" class="settings-header">
            <button class="button secondary" @click="$emit('close')">
                Cancel
            </button>

            <div class="title">
                Add External Link
            </div>

            <button class="button primary" @click="$emit('done')">
                Done
            </button>
        </div>
        <div id="body" class="settings-body">
            <div class="section">
                <div class="header">
                    External Link
                </div>
                <div class="sub-header">
                    Where do you want participants to visit?
                </div>
                <input class="section-input" v-model="link"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const link = ref<string>('');
</script>

<style scoped>
#event-external-link-setting {
    width: 100%;
    padding: 1rem;
    background-color: var(--primary-background-color);
}
</style>