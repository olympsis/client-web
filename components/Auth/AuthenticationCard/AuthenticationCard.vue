<template>
    <div id="authentication-card">
        <div id="header" v-if="props.showCancel">
            <button @click="$emit('close')" autofocus>Cancel</button>
        </div>
        <h1>Olympsis</h1>
        <h2>
            Organize sports together. Join groups, find locations, and get active!
        </h2>
        <div class="auth-buttons">
            <button id="apple-button" @click="signInWithApple">
                <img src="@/assets/icons/auth/apple.svg"/>
                Sign in with Apple
            </button>

            <button id="google-button" @click="signInWithGoogle">
                <img src="@/assets/icons/auth/google.svg"/>
                Sign in with Google
            </button>
        </div>

        <div id="notice">
            By signing up, you agree to our <RouterLink to="/terms-of-use" class="policy-link">Terms of Service</RouterLink> and <RouterLink to="/privacy-policy" class="policy-link">Privacy Policy</RouterLink>
        </div>
    </div>
</template>

<script setup lang="ts">
const emits = defineEmits([
    'apple', 
    'google', 
    'close'
]);
const props = defineProps({
    showCancel: { type: Boolean, default: false }
});

function signInWithApple() {
    emits('apple');
}

function signInWithGoogle() {
    emits('google');
}

</script>

<style scoped>
#authentication-card {
    margin: auto;
    height: 30rem;
    display: flex;
    max-width: 25rem;
    padding: 2rem 2rem;
    align-items: center;
    border-radius: 10px;
    flex-direction: column;
    background-color: var(--primary-brand-color);

    h1 {
        color: white;
        font-size: 1.8em;
        text-align: center;
        margin: 1rem 0rem;
    }

    h2 {
        color: white;
        font-size: 1.1em;
        text-align: center;
        font-weight: normal;
    }

    .auth-buttons {
        display: flex;
        margin: 2.5rem 0rem;
        flex-direction: column;
        justify-content: space-between;

        img {
            cursor: pointer;
        }
    }

    #apple-button {
        color: black;
        display: flex;
        width: 17rem;
        border: unset;
        height: 3.1rem;
        cursor: pointer;
        font-weight: 500;
        margin: 1rem 0rem;
        font-size: 1.2rem;
        align-items: center;
        border-radius: 10px;
        justify-content: center;
        background-color: white;
        
        img {
            height: 2rem;
            height: 2rem;
        }
    }

    #apple-button:focus {
        outline: var(--tertiary-brand-color) solid 2px;
    }

    #google-button {
        color: black;
        display: flex;
        width: 17rem;
        border: unset;
        height: 3.1rem;
        cursor: pointer;
        font-weight: 500;
        font-size: 1.2rem;
        align-items: center;
        border-radius: 10px;
        justify-content: center;
        background-color: white;

        img {
            height: 1rem;
            height: 1rem;
            margin: 0.5rem;
        }
    }

    #google-button:focus {
        outline: var(--tertiary-brand-color) solid 2px;
    }
}

@media (max-width: 25rem) {
    #authentication-card {
        border-radius: unset;
    }
}

.policy-link {
    text-decoration: underline;
    color: var(--tertiary-brand-color);
}

#notice {
    color: white;
    margin-top: 1rem;
    font-size: 0.8rem;
}

#header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: end;

    button {
        all: unset;
        color: white;
        cursor: pointer;
        font-size: 0.9rem;
    }

    button:focus {
        color: var(--tertiary-brand-color);
    }
}
</style>