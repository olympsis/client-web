<template>
    <div id="group-logo-banner">
        <img id="logo" :src="logo" @error="logoFailed = true" v-if="!logoFailed && logo !== undefined"/>
        <img id="banner" :src="banner" @error="bannerFailed = true" v-if="!bannerFailed && banner !== undefined"/>

        <picture id="default-logo" v-if="logoFailed || logo === undefined">
            <source srcset="@/assets/icons/group/group.fill.white.svg" media="(prefers-color-scheme: dark)">
            <img src="@/assets/icons/group/group.fill.svg"/>
        </picture>

        <picture id="default-banner" v-if="bannerFailed || banner === undefined">
            <source srcset="@/assets/icons/picture/picture.fill.white.svg" media="(prefers-color-scheme: dark)">
            <img src="@/assets/icons/picture/picture.fill.svg"/>
        </picture>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { generateImageURL } from '~/utils/image-helpers';

const props = defineProps({
    logoURL: { required: true },
    bannerURL: { required: true }
});

const logoFailed = ref(false);
const bannerFailed = ref(false);

const logo = computed<string | undefined>(() => {
    if (!props.logoURL) return undefined;
    return generateImageURL(props.logoURL as string);
});

const banner = computed<string | undefined>(() => {
    if (!props.bannerURL) return undefined;
    return generateImageURL(props.bannerURL as string);
});

</script>

<style scoped>
#group-logo-banner {
    width: 100%;
    position: relative;
    margin-bottom: 5rem;

    #logo {
        width: 8rem;
        height: 8rem;
        display: flex;
        margin-top: 16rem;
        margin-left: 2rem;
        position: absolute;
        align-items: center;
        justify-content: center;
        border: 4px solid var(--primary-label-color);
        background-color: var(--secondary-background-color);

        img {
            width: 3rem;
            height: 3rem;
        }
    }

    #banner {
        display: flex;
        width: 100%;
        height: 20rem;
        align-items: center;
        justify-content: center;
        background-color: var(--secondary-background-color);

        img {
            width: 3rem;
            height: 3rem;
        }
    }

    #default-banner {
        display: flex;
        width: 100%;
        height: 20rem;
        align-items: center;
        justify-content: center;
        background-color: var(--secondary-background-color);

        img {
            width: 3rem;
            height: 3rem;
        }
    }

    #default-logo {
        width: 8rem;
        height: 8rem;
        display: flex;
        margin-top: 16rem;
        margin-left: 2rem;
        position: absolute;
        align-items: center;
        justify-content: center;
        border: 4px solid var(--primary-label-color);
        background-color: var(--secondary-background-color);

        img {
            width: 3rem;
            height: 3rem;
        }
    }
}
</style>