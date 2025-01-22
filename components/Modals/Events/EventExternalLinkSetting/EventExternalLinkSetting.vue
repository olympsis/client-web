<template>
    <div id="event-external-link-setting" class="popup">
        <div id="header" class="header">
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
        <div id="body" class="body">
            <div class="section">
                <div class="header">
                    External Link
                </div>
                <div class="sub-header">
                    Where do you want participants to visit?
                </div>
                <input class="input" v-model="link"/>
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

    .input {
        width: 100%;
        height: 2rem;
        border: unset;
        margin-top: 0.5rem;
        font-size: 1.25rem;
        border-radius: 10px;
        padding: 0rem 0.5rem;
        background-color: var(--secondary-background-color);
    }
}
</style>