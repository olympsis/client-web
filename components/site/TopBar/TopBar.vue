<template>
    <div class="bar-container">
        <RouterLink to="/signin" class="name" @click="hideMenu">Olympsis</RouterLink>

        <div class="menu" :class="{ 'full_menu': isOpen }" :v-show="isOpen">
            <RouterLink id="link" to="/privacy-policy" active-class="selected-link" class="link" @click="hideMenu"> Privacy Policy </RouterLink>
            <RouterLink id="link2" to="/terms-of-use" active-class="selected-link" class="link" @click="hideMenu"> Terms of Use </RouterLink>
            <RouterLink id="link2" to="/contact" active-class="selected-link" class="link" @click="hideMenu"> Contact Us </RouterLink>
            <RouterLink v-if="isOpen" to="/signin" active-class="selected" class="button" @click="hideMenu"> Signin </RouterLink>
        </div>

        <RouterLink id="signin" to="/signin" active-class="selected" class="button"> Signin </RouterLink>

        <div class="hamburger" :class="{ 'open': isOpen }" @click="toggleMenu">
            <span class="hamburger__top-bun"></span>
            <span class="hamburger__bottom-bun"></span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false);

function toggleMenu() {
    isOpen.value = !isOpen.value;
}

function hideMenu() {
    isOpen.value = false;
}

</script>

<style scoped>
@import '@assets/main.css';

.bar-container {
    width: 100%;
    min-height: 60px;
    max-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-brand-color);
}

.name {
    color: white;
    margin-left: 1rem;
    font-size: 1.5rem;
    font-weight: bold;
    margin-right: 1rem;
    font-style: oblique;
    font-family: 'Roboto';
}

.menu {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    font-family: 'Helvetica Nue', 'Arial', 'Roboto', sans-serif;
    font-size: 0.9rem;

    .link {
        color: white;
        margin-left: 1rem;
        margin-right: 1rem;
    }
    #link2 {
        margin-left: 1rem;
        margin-right: 1rem;
    }
}

.button {
    color: white;
    margin: 0rem 1rem;
    padding: 0.3rem 1rem;
    border-radius: 10px;
    border: 2px solid white;
}

.selected {
    background-color: white;
    color: var(--primary-brand-color);
}

.selected-link {
    font-weight: bold;
}

@media screen and (max-width: 599px) {
    .name {
        margin-left: 1rem;
        margin-right: 1rem;
    }

    .menu {
        display: none;
        margin: auto;
    }

    #signin {
        display: none;
    }

    .full_menu {
        display: flex;
        flex-direction: column;
        position: absolute;
        width: 100%;
        top: 55px;
        bottom: 0;
        left: 0;
        z-index: 100;
        justify-content: flex-start;
        background-color: var(--primary-brand-color);

        .link {
            color: white;
            margin-top: 1rem;
            margin-bottom: 1rem;
            margin-left: 1rem;
            margin-right: auto !important;
        }
    }

    .bar-container {
        justify-content: space-between;
    }
        
    .hamburger {
        cursor: pointer;
        width: 48px;
        height: 48px;
        display: flex;
        margin-right: 1rem;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        transition: all 0.25s;
    }

    .hamburger__top-bun,
    .hamburger__bottom-bun {
        content: '';
        display: block;
        left: 15px;
        width: 28px;
        height: 2px;
        background: white;
        transform: rotate(0);
        transition: all 0.25s;
    }

    .hamburger__top-bun {
        top: 23px;
        transform: translateY(-3px);
    }

    .hamburger__bottom-bun {
        bottom: 23px;
        transform: translateY(3px);
    }

    .open {
        transform: rotate(90deg);
    }

    .open .hamburger__top-bun {
        transform: 
            rotate(45deg) 
            translateY(0px)
            translateX(1px);
    }

    .open .hamburger__bottom-bun {
        transform: 
            rotate(-45deg) 
            translateY(0px)
            translateX(1px);
    }
}
</style>