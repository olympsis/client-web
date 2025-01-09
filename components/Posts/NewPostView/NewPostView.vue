<template>
    <div id="new-post-view">
        <div id="header">
            <button @click="$emit('close')">
                Cancel
            </button>

            <h1> New Post </h1>

            <div :style="{ 'width': '4rem' }"/>
        </div>

        <div id="body">
            <div id="image-container">
                <img v-if="postImageURL" :src="postImageURL" @click="handleFileImageSelection">
                <input
                    type="file"
                    ref="file-input"
                    accept="image/*"
                    multiple="false"
                    @change="handleFileUpload"
                    style="display: none"
                />
            </div>
            <textarea type="text" placeholder="Write a caption" v-model="postBody" class="text-large"/>
            <div id="actions">
                <button id="image-button" @click="handleFileImageSelection">
                    <img src="@/assets/icons/picture/picture.fill.white.svg">
                </button>
            </div>
        </div>

        <div id="footer">
            <BoldTextButton v-model="state" text="create" @click="createPost"/>
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
                    @close="showMediaPicker = false"
                    @cropped-media-results="handleCroppedMediaData"
                />
            </template>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { type Ref, ref, type ShallowRef, useTemplateRef } from 'vue';
import { NewPostManager } from '@/data/managers/NewPostManager';
import { type CroppedMedia } from '@/data/GlobalData';
import { CROP_SHAPE, VIEW_STATE } from '~/data/Enums';

import Dialog from 'primevue/dialog';
import MediaPicker from '@/components/MediaPicker/MediaPicker.vue';
import BoldTextButton from '@/components/Buttons/LoadingButtons/BoldTextButton/BoldTextButton.vue';
import { useSessionStore } from '@/stores/session-store';

const session = useSessionStore();
const manager = new NewPostManager();
const emit = defineEmits(['close','created']);

const state: Ref<VIEW_STATE> = ref(VIEW_STATE.PENDING);
const fileInput: ShallowRef<HTMLInputElement | null> =  useTemplateRef('file-input');

const postBody: Ref<string> = ref('');
const postImageURL: Ref<string | undefined> = ref(undefined);

const mediaCropShape = ref(CROP_SHAPE.SQUARE);    
const mediaPickerImages: Ref<File[]> = ref([]);
const showMediaPicker = ref<boolean>(false);

function handleFileUpload(event: any) { 
    mediaPickerImages.value.push(...event.target.files);
    showMediaPicker.value = true;
}

function handleCroppedMediaData(data: Array<CroppedMedia>) {
    if (data) {
        if (data[0]) {
            postImageURL.value = data[0]?.url
        }
    }
    showMediaPicker.value = false;
}

function handleFileImageSelection() {
    removeUploadedFile();
    if (fileInput.value) {
        fileInput.value.value = '';
        fileInput.value?.click();
    }
}

function removeUploadedFile() {
    if (postImageURL.value) {
        mediaPickerImages.value = [];
        URL.revokeObjectURL(postImageURL.value);
        postImageURL.value = '';
    }
}

async function createPost() {
    if (postBody.value.length < 5) return;

    const groupID = session.selectedGroup?.club?.id ?? session.selectedGroup?.organization?.id;
    if (!groupID) return;

    state.value = VIEW_STATE.LOADING;

    const newPost = await manager.createNewPost(
        groupID,
        postBody.value,
        postImageURL.value ? [postImageURL.value] : undefined
    )
    
    if (newPost) {
        emit('created', { newPost });
    } else {
        state.value = VIEW_STATE.FAILURE;
    }
}

</script>

<style scoped>
#new-post-view {
    width: 100%;
    max-width: 35rem;
    border-radius: 15px;
    background-color: var(--primary-background-color);

    #header {
        display: flex;
        padding: 1rem;
        justify-content: space-between;

        button {
            all: unset;
            cursor: pointer;
            font-size: 0.9rem;
            color: var(--primary-label-color);
        }

        h1 {
            font-size: 1rem;
            font-style: italic;
            text-transform: uppercase;
            color: var(--primary-label-color);
        }
    }

    #body {
        margin: 0rem 1rem;

        #image-container{
            display: flex;
            margin: 1rem auto;
            align-items: center;
            justify-content: center;

            img {
                width: auto;
                height: 100%;
                max-width: 30rem;
            }
        }

        .text-large {
            width: 100%;
            height: 6rem;
            border: unset;
            padding: 0.5rem;
            font-size: 1rem;
            font-size: 1.3rem;
            border-radius: 10px;
            color: var(--primary-label-color);
            background-color: var(--tertiary-background-color);
        }

        #actions {
            margin: 0.5rem;
            display: flex;

            #image-button {
                border: unset;
                cursor: pointer;
                margin-left: auto;
                border-radius: 10px;
                padding: 1rem 1.5rem;
                background-color: var(--primary-brand-color);
            }
        }
    }

    #footer {
        height: 6rem;
        margin: 2.5rem 3rem;
    }
}
</style>