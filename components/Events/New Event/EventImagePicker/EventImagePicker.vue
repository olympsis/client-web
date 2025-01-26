<template>
    <div id="images-list">
        <div class="event-image" v-for="image in images" @click="selectAnImage(image)">
            <img :src="generateImageURL(image)" :class="{ selected: selectedImage == image, 'image-card': true  }"/>
        </div>

        <input
            type="file"
            ref="file-input"
            accept="image/*"
            multiple="false"
            @change="handleFileUpload"
            style="display: none"
        />
        <div v-if="!uploadedMediaURL" id="upload-button" class="image-card" @click="handleFileImageSelection">
            <picture>
                <source srcset="@/assets/icons/add/add.white.svg" media="(prefers-color-scheme: dark)"/>
                <img src="@/assets/icons/add/add.svg"/>
            </picture>
            Upload
        </div>
        
        <div v-if="uploadedMediaURL" id="preview" class="event-image" @click="uploadedMediaURL ? selectAnImage(uploadedMediaURL) : () => {}">
            <img src="@/assets/icons/xmark/xmark.white.svg" class="close-button" @click="removeUploadedFile">
            <img :src="uploadedMediaURL" :class="{ selected: selectedImage == uploadedMediaURL, 'image-card': true }">
        </div>

        <Dialog
            position="center"
            blockScroll
            :visible="showMediaPicker"
            :style="{ 'top': '10px', 'height': '65vh', 'overflow': 'hidden', 'max-width': '32rem' }"
        >
            <template #container>
                <MediaPicker 
                    :crop-shape="mediaCropShape" 
                    :medias="mediaPickerImages" 
                    @cropped-media-results="handleCroppedMediaData"
                />
            </template>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { CROP_SHAPE } from '~/data/Enums';
import { generateImageURL } from '~/utils/image-extensions';
import type { ComputedRef, ShallowRef } from 'vue';
import { type CroppedMedia } from '~/data/GlobalData';
import { computed, ref, useTemplateRef, watch } from 'vue';
import { SPORTS, sportsInternalImages} from '~/data/Enums';

import Dialog from 'primevue/dialog';
import MediaPicker from '@/components/MediaPicker/MediaPicker.vue';

const selectedSport = defineModel('selectedSport', { default: SPORTS.SOCCER });
const selectedImage = defineModel('selectedImage', { default: '' });

const images: ComputedRef<string[]> = computed(() => {
    return sportsInternalImages(selectedSport.value)
});

const fileInput: ShallowRef<HTMLInputElement | null> =  useTemplateRef('file-input');

const showMediaPicker = ref<boolean>(false);
const mediaPickerImages = ref<Array<File>>([]);
const mediaCropShape = ref(CROP_SHAPE.PORTRAIT);
const uploadedMediaURL = ref<string | undefined>(undefined);

watch(selectedSport, (newValue, _) => {
    const imageList = sportsInternalImages(newValue);
    const first = imageList[0];
    if (uploadedMediaURL.value) {
        selectedImage.value = uploadedMediaURL.value;
    } else if (first) {
        selectedImage.value = first;
    } 
}, { immediate: true });

watch(uploadedMediaURL, (newValue, _) => {
    if (!newValue) return;
    selectedImage.value = newValue;
});

function selectAnImage(image: string) {
    selectedImage.value = image
}

function handleFileImageSelection() {
    removeUploadedFile();
    if (fileInput.value) {
        fileInput.value.value = '';
        fileInput.value?.click();
    }
}

function handleFileUpload(event: any) { 
    mediaPickerImages.value.push(...event.target.files);
    showMediaPicker.value = true;
}

function handleCroppedMediaData(data: Array<CroppedMedia>) {
    if (data) {
        if (data[0]) {
            uploadedMediaURL.value = data[0]?.url
        }
    }
    closeMediaPicker();
}

function removeUploadedFile() {
    if (uploadedMediaURL.value) {
        URL.revokeObjectURL(uploadedMediaURL.value);
        uploadedMediaURL.value = undefined;
    }
}

function closeMediaPicker() {
    showMediaPicker.value = false;
}

</script>

<style scoped>
#images-list {
    display: flex;
    overflow: scroll;

    .image-card {
        width: 10rem;
        height: 15rem;
        cursor: pointer;
        min-width: 10rem;
        margin: 0rem 0.7rem;
        border-radius: 10px;

        img {
            width: 10rem;
            height: 15rem;
            border-radius: 10px;
        }
    }

    .selected {
        border: 2px solid var(--secondary-brand-color);
    }

    .event-image {
        .close-button {
            width: 1.5rem;
            height: 1.5rem;
            margin: 0.5rem;
            cursor: pointer;
            margin-left: 8.5rem;
            border-radius: 5px;
            background-color: var(--primary-brand-color);
        }
    }
    
    #upload-button {
        display: flex;
        cursor: pointer;
        font-size: 0.6rem;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        color: var(--primary-label-color);
        background-color: var(--secondary-background-color);

        img {
            width: 1.5rem;
            height: 1.5rem;
        }
    }
}
</style>