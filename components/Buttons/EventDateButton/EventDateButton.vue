<template>
    <div id="event-date-button" @click="handleInputClick">
        <img src="@assets/icons/calendar/calendar.edit.fill.white.svg">
        <input id="input" class="input" ref="input-ref" type="date" v-model.lazy="model">
    </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';

const inputRef = useTemplateRef<HTMLInputElement>('input-ref');

const model = defineModel({
    default: Date.now().toLocaleString()
});

function handleInputClick() {
    if (inputRef.value) {
        inputRef.value.click()
    } else {
        console.error('Failed to find input template reference.')
    }
}
</script>

<style scoped>
#event-date-button {
    display: flex;
    width: fit-content;
    align-items: center;
    border-radius: 10px;
    background-color: var(--primary-brand-color);

    img {
        width: 1.5rem;
        height: 1.5rem;
        margin: 0.5rem;
    }

    input {
        color: white;
        font-size: 1rem;
        margin-right: 0.25rem;
        background-color: unset;
    }

    input[type="date"]::-webkit-datetime-edit-year-field {
        display: none;
    }

    input[type="date"]::-webkit-datetime-edit-month-field {
        margin-right: 0.25rem;
    }

    .input[type="date"]::-webkit-datetime-edit-text {
        display: none;
    }
}
</style>