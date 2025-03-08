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

        <ul id="list">
            <SportLabel v-for="sport in sports" :sport="sport"/>
        </ul>

        <div id="share" @click="$emit('clicked-share')">
            <img src="@/assets/icons/share/share.white.svg" alt="share button icon">
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { generateImageURL } from '~/utils/image-helpers';

import SportLabel from '~/components/SportLabel/SportLabel.vue';

const props = defineProps({
    logoURL: { required: true },
    bannerURL: { required: true },
    sports: { type: Array<string>, default: [] }
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
        border-radius: 50%;
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
        width: 100%;
        display: flex;
        height: 20rem;
        border-radius: 16px;
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
        border-radius: 16px;
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
        border-radius: 50%;
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

    #list {
        top: 0;
        gap: 1rem;
        padding: 0;
        margin: 1rem;
        display: flex;
        position: absolute;
    }

    #share {
        top: 0;
        right: 0;
        height: 42px;
        margin: 1rem 2rem;
        cursor: pointer;
        padding: 0.5rem;
        position: absolute;
        border-radius: 50%;
        border: 1px solid gray;
        text-transform: capitalize;
        backdrop-filter: blur(20px);
        background-blend-mode: hard-light;
        background: rgba(0, 0, 0, 0.56);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);

        img {
            height: 24px;
        }
    }
}
</style>