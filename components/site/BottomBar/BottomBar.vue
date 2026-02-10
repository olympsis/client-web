<template>
    <div id="bottom-bar-container">
        <div>
            <router-link id="link" to="/terms-of-use" class="link" > {{ $t('footer.termsOfUse') }} </router-link>
            <router-link id="link" to="/privacy-policy" class="link" > {{ $t('footer.privacyPolicy') }} </router-link>
            <router-link id="link" to="/contact-us" class="link" > {{ $t('footer.contactUs') }} </router-link>
            <a id="link" href="https://donate.stripe.com/bIY03V2LCduXfn27ss"> {{ $t('footer.donate') }} </a>
        </div>
        <a id="text"> Olympsis © 2026 </a>
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