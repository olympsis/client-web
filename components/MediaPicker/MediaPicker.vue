<template>
    <div id="media-picker-container">

        <!-- Media Picker Header -->
        <div id="header">
            <button @click="$emit('close')"> Cancel </button>
            <h1> Move and Scale </h1>
            <button @click="handlePrimaryAction"> {{ actionText }}</button>
        </div>

        <!-- Media Picker Body/Cropper -->
        <div id="cropper-wrapper">
            <Cropper
                v-if="currentMediaURL"
                class="cropper"
                ref="cropperRef"
                :src="currentMediaURL"
                :zoom-speed="0.5"
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
            <!-- Loading state while the image is being read -->
            <div v-else id="loading">
                <div class="spinner-loader"/>
            </div>
        </div>

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
import { ref, computed, type PropType, onMounted, watch, onUnmounted } from 'vue';

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
const currentMediaURL = computed<string | undefined>(() => mediaURLS.value[currentMediaIndex.value]);
const currentMediaIndexString = computed<string>(() => `${currentMediaIndex.value + 1}/${medias.value.length}`);

const croppedMediaData = ref<Array<CroppedMedia>>([]);

onMounted(() => {
    generateURLS();
});

watch(() => medias.value, () => {
    generateURLS();
}, { deep: true });

/**
 * Reads each file as a data URL (base64) instead of a blob URL.
 * Data URLs are more reliably handled by the cropper library
 * across browsers (especially Safari / iOS).
 */
async function generateURLS() {
    // Reset state
    mediaURLS.value = [];
    croppedMediaData.value = [];
    currentMediaIndex.value = 0;

    // Read each file as a data URL for reliable cross-browser rendering
    const urls = await Promise.all(
        medias.value.map((file) => readFileAsDataURL(file))
    );
    mediaURLS.value.push(...urls);
}

function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

function getStencilComponent() {
    return props.cropShape === CROP_SHAPE.CIRCLE ? CircleStencil : RectangleStencil
};

function getAspectRatio() {
    switch (props.cropShape) {
        case CROP_SHAPE.LANDSCAPE:
            return 4/3;
        case CROP_SHAPE.PORTRAIT:
            return 3/4;
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
    if (!canvas) return null;

    return new Promise((resolve) => {
        try {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve({
                        url: URL.createObjectURL(blob),
                        blob
                    });
                } else {
                    console.error('MediaPicker: canvas.toBlob returned null');
                    resolve(null);
                }
            }, 'image/jpeg', 0.85);
        } catch (error) {
            console.error('MediaPicker: Failed to export canvas:', error);
            resolve(null);
        }
    });
}

// NOTE: We intentionally do NOT revoke cropped blob URLs here.
// The parent component owns those URLs (for preview display)
// and is responsible for revoking them when done.
</script>

<style scoped>
#media-picker-container {
    height: 65vh;
    width: 100vw;
    max-width: 32rem;
    display: flex;
    flex-direction: column;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

    #header {
        height: 4rem;
        min-height: 4rem;
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

    #cropper-wrapper {
        flex: 1;
        min-height: 0;
        position: relative;
        background-color: black;

        .cropper {
            width: 100%;
            height: 100%;
        }

        #loading {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    #footer {
        height: 4rem;
        min-height: 4rem;
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
}
</style>
