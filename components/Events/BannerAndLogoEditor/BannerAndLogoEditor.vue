<template>
    <div id="banner-logo-editor">
        <!-- Banner Image & Placeholder -->
        <div id="banner" v-if="bannerURL === ''" @click="handleFileImageSelection('banner')">
            <picture class="default-img">
                <source srcset="@/assets/icons/picture/picture.fill.white.svg" media="(prefers-color-scheme: dark)">
                <img src="@/assets/icons/picture/picture.fill.svg">
            </picture>
        </div>
        <img id="banner" v-else :src="bannerURL"  @click="handleFileImageSelection('banner')"/>

        <!-- Logo Image & Placeholder -->
        <div id="logo" v-if="logoURL === ''"  @click="handleFileImageSelection('logo')">
            <picture class="default-img">
                <source srcset="@/assets/icons/picture/picture.fill.white.svg" media="(prefers-color-scheme: dark)">
                <img src="@/assets/icons/picture/picture.fill.svg">
            </picture>
        </div>
        <img id="logo" v-else :src="logoURL"  @click="handleFileImageSelection('logo')"/> 

        <input
            type="file"
            ref="file-input"
            accept="image/*"
            multiple="false"
            @change="handleFileUpload"
            style="display: none"
        />
        <dialog id="banner-picker" ref="banner-picker-modal" class="dialog">
            <MediaPicker 
                v-model:medias="bannerPickerImages" 
                :crop-shape="mediaCropShape" 
                @close="hideBannerPicker" 
                @cropped-media-results="handleCroppedBannerData"
            />
        </dialog>

        <dialog id="logo-picker" ref="logo-picker-modal" class="dialog">
            <MediaPicker 
                v-model:medias="logoPickerImages" 
                :crop-shape="mediaCropShape" 
                @close="hideLogoPicker" 
                @cropped-media-results="handleCroppedLogoData"
            />
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { CROP_SHAPE } from '~/data/Enums';
import { type CroppedMedia } from '~/data/GlobalData';

import MediaPicker from '~/components/MediaPicker/MediaPicker.vue';

const mediaCropShape = ref(CROP_SHAPE.SQUARE);

const pickingBoolean = ref<'logo' | 'banner'>('banner');

const logoURL = defineModel<string>('logo-url', { default: ''});
const bannerURL = defineModel<string>('banner-url', { default: ''});

const logoPickerImages = ref<Array<File>>([]);
const bannerPickerImages = ref<Array<File>>([]);

const inputRef = useTemplateRef<HTMLInputElement>('file-input');
const logoPickerRef = useTemplateRef<HTMLDialogElement>('logo-picker-modal');
const bannerPickerRef = useTemplateRef<HTMLDialogElement>('banner-picker-modal');
    

function showLogoPicker() {
    if (logoPickerRef.value) {
        logoPickerRef.value.show();
    } else {
        console.error('Failed to find logo picker template reference');
    }
}

function hideLogoPicker() {
    if (logoPickerRef.value) {
        logoPickerRef.value.close();
    } else {
        console.error('Failed to find logo picker template reference');
    }
}

function showBannerPicker() {
    if (bannerPickerRef.value) {
        bannerPickerRef.value.show();
    } else {
        console.error('Failed to find banner picker template reference');
    }
}

function hideBannerPicker() {
    if (bannerPickerRef.value) {
        bannerPickerRef.value.close();
    } else {
        console.error('Failed to find banner picker template reference');
    }
}

function handleFileImageSelection(value: 'logo' | 'banner') {
    if (inputRef.value) {
        inputRef.value.value = '';
        pickingBoolean.value = value;

        if (value === 'logo') {
            if (logoURL.value != '') {
                URL.revokeObjectURL(logoURL.value);
            }
            logoPickerImages.value.pop();
        } else {
            if (bannerURL.value != '') {
                URL.revokeObjectURL(bannerURL.value);
            }
            bannerPickerImages.value.pop();
        }
        inputRef.value?.click();
    }
}

function handleFileUpload(event: any) { 
    if (pickingBoolean.value === 'logo') {
        logoPickerImages.value.push(...event.target.files);
        showLogoPicker();
    } else if (pickingBoolean.value === 'banner') {
        bannerPickerImages.value.push(...event.target.files);
        showBannerPicker();
    }
}

function handleCroppedLogoData(data: Array<CroppedMedia>) {
    if (data) {
        if (data[0]) {
            logoURL.value = data[0]?.url
        }
    }
    hideLogoPicker();
}

function handleCroppedBannerData(data: Array<CroppedMedia>) {
    if (data) {
        if (data[0]) {
            bannerURL.value = data[0]?.url
        }
    }
    hideBannerPicker();
}
</script>

<style scoped>
#banner-logo-editor {
    width: 100%;
    position: relative;

    margin-top: 1rem;
    margin-bottom: 5rem;

    #banner {
        width: 100%;
        margin: auto;
        height: 20rem;
        display: flex;
        cursor: pointer;
        position: relative;
        align-items: center;
        justify-content: center;
        background-color: gray;

        @media (max-width: 940px) {
            width: 100%;
            height: 20rem;
        }
    }

    #logo {
        left: 37%;
        top: 17rem;
        width: 7.5rem;
        display: flex;
        height: 7.5rem;
        cursor: pointer;
        position: absolute;
        align-items: center;
        justify-content: center;
        background-color: gray;
        border: solid var(--secondary-background-color) 3px;

        @media (max-width: 940px) {
            left: 37%;
            top: 17rem;
            width: 7.5rem;
            height: 7.5rem;
        }
    }
}

#logo-picker {
    top: 5rem;
    border: unset;
    background: unset;
    position: absolute;
}

#banner-picker {
    top: 5rem;
    border: unset;
    background: unset;
    position: absolute;
}

</style>