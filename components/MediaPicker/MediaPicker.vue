<template>
    <div id="media-picker-container">

        <!-- Media Picker Header -->
        <div id="header">
            <button @click="$emit('close')"> Cancel </button>
            <h1> Move and Scale </h1>
            <button @click="handlePrimaryAction"> {{ actionText }}</button>
        </div>

        <!-- Media Picker Body/Cropper -->
        <Cropper
            class="cropper"
            ref="cropperRef"
            :src="currentMediaURL"
            :zoom-speed="0.5"
            :scaling-restriction="{
                minScale: 1,
                maxScale: 3
            }"
            :stencil-component="getStencilComponent()"
            :stencil-props="{
                handlers: {},
                movable: false,
                resizable: false,
                aspectRatio: getAspectRatio(),
                previewClass: 'preview',
                class: {
                    'cropper-stencil': true,
                    'circle': cropShape === CROP_SHAPE.CIRCLE
                }
            }"
            :resize-image="{
                adjustStencil: false
            }"
            image-restriction="stencil"
        />

        <!-- Media Picker Footer -->
        <div id="footer">
            <h1> {{ currentMediaIndexString }} </h1>
        </div>

    </div>
</template>

<script setup lang="ts">
import 'vue-advanced-cropper/dist/style.css';
import { CROP_SHAPE } from '~/data/Enums';
import { type CroppedMedia } from '@/data/GlobalData';
import { Cropper, CircleStencil, RectangleStencil } from 'vue-advanced-cropper';
import { ref, computed, type PropType, onMounted, onUpdated, watch, onUnmounted } from 'vue';

const emit = defineEmits<{
    (e: 'close'): void,
    (e: 'croppedMediaResults', data: Array<CroppedMedia>): void
}>()
const props = defineProps({
    cropShape: {
        type: String as PropType<CROP_SHAPE>,
        default: CROP_SHAPE.SQUARE
    },
});

const medias = defineModel<Array<File>>('medias', {
    default: []
});

const actionText = computed<string>(() => {
    return (currentMediaIndex.value + 1) == medias.value.length ? 'Done' : 'Next';
});

const currentMediaIndex = ref<number>(0);
const mediaURLS = ref<Array<string>>([]);

const cropperRef = ref<InstanceType<typeof Cropper> | null>(null);
const currentMediaURL = computed<string | undefined> (() => mediaURLS.value[currentMediaIndex.value]);
const currentMediaIndexString = computed<string>(() =>`${currentMediaIndex.value + 1}/${medias.value.length}`);

const croppedMediaData = ref<Array<CroppedMedia>>([]);

onMounted(() => {
    generateURLS();
});

watch(medias.value, () => {
   generateURLS();
});

function generateURLS() {
    // Clear up array just in case of leftover data
    mediaURLS.value = [];
    croppedMediaData.value = [];

    // Generate a url for each selected media provided
    const urls = medias.value.map((m) => URL.createObjectURL(m));
    mediaURLS.value.push(...urls);
}

function getStencilComponent() {
    return props.cropShape === CROP_SHAPE.CIRCLE ? CircleStencil : RectangleStencil
};

function getAspectRatio() {
    switch (props.cropShape) {
        case CROP_SHAPE.LANDSCAPE:
            return 16/9;
        case CROP_SHAPE.PORTRAIT:
            return 9/16;
        case CROP_SHAPE.SQUARE:
            return 1;
        case CROP_SHAPE.CIRCLE:
            return 1;
        default:
            return 1;
    }
}

async function handlePrimaryAction() {
    const data = await getCroppedImage()
    if (data) croppedMediaData.value.push(data);

    const isLastImage = (currentMediaIndex.value + 1) == medias.value.length;
    if (isLastImage) {
        emit('croppedMediaResults', croppedMediaData.value);
    } else {
        currentMediaIndex.value = currentMediaIndex.value + 1;
    }
}

async function getCroppedImage(): Promise<CroppedMedia | null> {
    if (!cropperRef.value) return null;

    const { canvas } = cropperRef.value.getResult();
    return new Promise((resolve) => {
        canvas?.toBlob((blob) => {
            if (blob) {
                resolve({
                    url: URL.createObjectURL(blob),
                    blob
                });
            } else {
                resolve(null);
            }
        }, 'image/jpeg', 0.5);
    });
}
</script>

<style scoped>
#media-picker-container {

    height: 65vh;
    width: 100vw;
    max-width: 32rem;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

    #header {
        height: 4rem;
        display: flex;
        padding: 0rem 1rem;
        align-items: center;
        justify-content: space-between;
        border-radius: 10px 10px 0px 0px;
        background-color: var(--secondary-background-color);

        button {
            height: 2rem;
            border: unset;
            cursor: pointer;
            font-size: 0.8rem;
            background-color: unset;
            color: var(--primary-label-color);
        }

        h1 {
            font-size: 1rem;
            font-weight: normal;
            color: var(--primary-label-color);
        }
    }

    .cropper {
        flex: 1;
        width: 100%;
        height: calc(100% - 8rem);
        background-color: black;
    }

    #footer {
        height: 4rem;
        display: flex;
        align-items: center;
        justify-content: space-around;
        border-radius: 0px 0px 10px 10px;
        background-color: var(--secondary-background-color);

        h1 {
            font-size: 1rem;
            color: var(--primary-label-color);
        }
    }

    #picker-header {
        margin: 1rem;
        display: flex;
        justify-content: space-between;
    }

    #picker-body {
        overflow: hidden;
        width: fit-content;

        #placeholder {
            width: 100%;
            height: 100%;
            background-color: gray;
        }

        #image {
            height: auto;
            max-width: 32rem;
            aspect-ratio: auto;
        }

        #crop-box {
            cursor: grab;
            position: absolute;
            border: 5px solid var(--primary-brand-color);
        }

        #picker-body {
            width: 100%;
            height: auto;
        }
    }

    #image-container {
        #image-canvas {
            width: 100%;
            height: auto;
        }
    }
}
</style>