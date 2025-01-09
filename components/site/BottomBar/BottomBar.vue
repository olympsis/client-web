<template>
    <div id="bottom-bar-container">
        <div>
            <router-link id="link" to="/terms-of-use" class="link" > Terms of Use </router-link>
            <router-link id="link" to="/privacy-policy" class="link" > Privacy Policy </router-link>
            <router-link id="link" to="/contact-us" class="link" > Contact Us </router-link>
            <a id="link" href="https://donate.stripe.com/bIY03V2LCduXfn27ss"> Donate </a>
        </div>
        <a id="text"> Olympsis © 2024 </a>
    </div>
</template>

<style scoped>
@import '@/assets/css/main.css';

#bottom-bar-container {
    display: flex;
    height: 130px;
    width: 100%;
    flex-direction: column;
    align-items: center;

    justify-content: space-evenly;
    background-color: var(--primary-brand-color);
}

#text {
    color: white;
    font-size: 0.7em;
    font-family: 'Helvetica Nue', 'Arial', 'Roboto', sans-serif;
}

#link {
    color: white;
    font-size: 0.7em;
    font-family: 'Helvetica Nue', 'Arial', 'Roboto', sans-serif;
    margin: 10rem 1rem;
}
</style>