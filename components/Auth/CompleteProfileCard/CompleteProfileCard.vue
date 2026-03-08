<template>
    <div id="complete-profile-card">
        <h1>Complete Your Profile</h1>
        <h2>We need a few more details to finish setting up your account.</h2>

        <div class="field">
            <h3>First Name</h3>
            <input type="text" v-model="firstName" autocomplete="given-name" placeholder="First name" />
        </div>

        <div class="field">
            <h3>Last Name</h3>
            <input type="text" v-model="lastName" autocomplete="family-name" placeholder="Last name" />
        </div>

        <div class="field">
            <h3>Email</h3>
            <input type="email" v-model="email" autocomplete="email" placeholder="Email address" />
        </div>

        <p v-if="hasError" class="error">Please fill in all fields to continue.</p>

        <button id="action-button" @click="handleSubmit">
            <TextButton text="Continue" success-text="Success" failure-text="Failed" :model-value="state" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VIEW_STATE } from '~/data/Enums';
import TextButton from '~/components/Buttons/LoadingButtons/TextButton/TextButton.vue';

const props = defineProps<{
    /** Pre-fill values from whatever Apple/Firebase provided */
    initialFirstName?: string
    initialLastName?: string
    initialEmail?: string
}>();

const state = defineModel('state', { default: VIEW_STATE.PENDING });
const emits = defineEmits(['submit']);

const firstName = ref(props.initialFirstName ?? '');
const lastName = ref(props.initialLastName ?? '');
const email = ref(props.initialEmail ?? '');
const hasError = ref(false);

function handleSubmit() {
    if (!firstName.value.trim() || !lastName.value.trim() || !email.value.trim()) {
        hasError.value = true;
        return;
    }
    hasError.value = false;
    emits('submit', {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
    });
}
</script>

<style scoped>
#complete-profile-card {
    margin: auto;
    display: flex;
    max-width: 25rem;
    padding: 2rem 2rem;
    align-items: center;
    border-radius: 10px;
    flex-direction: column;
    background-color: var(--secondary-background-color);

    h1 {
        color: var(--primary-label-color);
        font-size: 1rem;
        text-align: center;
        margin: 0.5rem 0rem;
    }

    h2 {
        font-size: 0.8em;
        text-align: center;
        font-weight: normal;
        margin-bottom: 1rem;
        color: var(--primary-label-color);
    }

    .field {
        width: 100%;
        margin-bottom: 0.75rem;

        h3 {
            font-size: 0.9rem;
            font-weight: normal;
            color: var(--primary-label-color);
        }

        input {
            width: 100%;
            height: 2rem;
            border: unset;
            font-size: 1rem;
            border-radius: 5px;
            margin: 0.25rem 0rem;
            padding: 0rem 0.5rem;
            color: var(--primary-label-color);
            background-color: var(--tertiary-background-color);
        }
    }

    .error {
        color: #e74c3c;
        font-size: 0.75rem;
        margin-bottom: 0.5rem;
    }

    #action-button {
        height: 2.5rem;
        color: white;
        display: flex;
        border: unset;
        cursor: pointer;
        border-radius: 5px;
        font-style: italic;
        border-color: unset;
        align-items: center;
        padding: 0.5rem 1rem;
        text-transform: uppercase;
        background-color: var(--primary-brand-color);
    }
}

@media (max-width: 25rem) {
    #complete-profile-card {
        border-radius: unset;
    }
}
</style>
