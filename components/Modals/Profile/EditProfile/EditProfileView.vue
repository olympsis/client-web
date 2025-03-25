<template>
    <div id="edit-profile-view">
        <div id="header">
            <button id="cancel" @click="$emit('close')">
                Cancel
            </button>
            
            
            <div id="primary-action">
                <button id="save" v-if="viewState === VIEW_STATE.PENDING" @click="updateUserProfile">
                    Save
                </button>
                <div v-if="viewState === VIEW_STATE.LOADING" class="spinner-loader"/>
            </div>
        </div>
        <div id="body">
            <div id="profile-image" class="section" @click="handleFileImageSelection">
                <img
                    v-if="profileImageURL" 
                    alt="User profile image"
                    :src="profileImageURL"
                />
                <div id="template" v-else>
                    
                </div>
                <input 
                    ref="image-input" 
                    type="file" 
                    :style="{ display: 'none' }"
                    @change="handleFileUpload"
                />
            </div>

            <div id="username" class="section">
                <div class="title">Username</div>
                <div class="sub-title">What would you like your handle to be?</div>
                <input type="text" v-model="username" disabled>
            </div>

            <div id="bio" class="section">
                <div class="title">Bio</div>
                <div class="sub-title">Share some information about yourself</div>
                <textarea v-model="bio"/>
            </div>

            <div id="sports" class="section">
                <div class="title">Sports</div>
                <div class="sub-title">What athletic activities are you into?</div>
                <MultiSportsPicker :multi-select="true" :sports="session.sports" v-model:model-value="userSports"/>
            </div>

            <div id="hometown" class="section">
                <div class="title">Hometown</div>
                <div class="sub-title">Where do you call home? We need a fall back location if we can't find your location.</div>
                <button @click="" :style="{ color: 'gray' }">
                    {{ localeText }}
                </button>
            </div>

            <dialog id="locale-modal" ref="locale-modal" class="dialog">
                <LocalePicker @close="closeLocaleModal" @completed="handleLocaleChanged" :show-cities="true"/>
            </dialog>

            <dialog id="media-picker-modal" ref="media-picker-modal">
                <MediaPicker
                    v-model:medias="mediaPickerImages" 
                    :crop-shape="mediaCropShape" 
                    @close="hideMediaPicker" 
                    @cropped-media-results="handleCroppedMediaData"
                />
            </dialog>
        </div>
    </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { UserDTO } from '~/data/models/UserModels';
import { CROP_SHAPE, VIEW_STATE } from '~/data/Enums';
import type { CroppedMedia } from '~/data/GlobalData';
import { UserService } from '~/data/services/UserService';
import { UploadService } from "@/data/services/UploadService";

import MediaPicker from '~/components/MediaPicker/MediaPicker.vue';
import LocalePicker from '~/components/LocalePicker/LocalePicker.vue';
import MultiSportsPicker from '~/components/MultiSportsPicker/MultiSportsPicker.vue';
import type { Sport } from '~/data/models/GenericModels';


const session = useSessionStore();
const service = new UserService();
const emits = defineEmits(['close']);
const uploadService = new UploadService();

const bio = ref<string>('');
const username = ref<string>('');
const homeTownCoordinates = ref<number[]>([]);
const userSports = ref<Sport[]>([]);
const viewState = ref<VIEW_STATE>(VIEW_STATE.PENDING);

const imageInputRef = useTemplateRef<HTMLInputElement>('image-input');
const localeModalRef = useTemplateRef<HTMLDialogElement>('locale-modal');
const mediaModalRef = useTemplateRef<HTMLDialogElement>('media-picker-modal');

const mediaPickerImages = ref<File[]>([]);
const mediaCropShape = ref(CROP_SHAPE.CIRCLE);
const newImageURL = ref<string | undefined>(undefined);
const profileImageURL = ref<string | undefined>(undefined);

const country = ref<string | undefined>(undefined);
const adminArea = ref<string | undefined>(undefined);
const subAdminArea = ref<string | undefined>(undefined);


const localeText = computed<string>(() => {
    if (!country.value) {
        return 'N/A';
    } else {
        return `${subAdminArea.value}, ${adminArea.value} (${country.value})`;
    }
})

function showLocaleModal() {
    localeModalRef.value?.show()
}

function closeLocaleModal() {
    localeModalRef.value?.close();
}

function handleLocaleChanged(event: any) {
    if (!event) return;
    country.value = event.country;
    adminArea.value = event.state;
    subAdminArea.value = event.city;
    
    closeLocaleModal();
}

function handleFileImageSelection() {
    if (imageInputRef.value) {
        mediaPickerImages.value.pop();
        imageInputRef.value.value = '';
        if (newImageURL.value) {
            URL.revokeObjectURL(newImageURL.value);
        }
        imageInputRef.value?.click();
    }
}

function handleFileUpload(event: any) { 
    mediaPickerImages.value.push(...event.target.files);
    showMediaPicker()
}

function handleCroppedMediaData(data: Array<CroppedMedia>) {
    if (data) {
        if (data[0]) {
            newImageURL.value = data[0]?.url
            profileImageURL.value = data[0]?.url
        }
    }
    hideMediaPicker();
}

function showMediaPicker() {
    mediaModalRef.value?.show();
}

function hideMediaPicker() {
    mediaModalRef.value?.close();
}

async function updateUserProfile() {
    viewState.value = VIEW_STATE.LOADING;

    const update = new UserDTO();
    if (username.value != '') {
        update.username = username.value;
    }

    if (bio.value != '') {
        update.bio = bio.value;
    }

    update.sports = userSports.value.map((s) => {
        return s.name.split(' ')[1]
    });

    if (homeTownCoordinates.value.length > 0) {
        update.hometown = homeTownCoordinates.value;
    }

    // Upload new image if we have one
    if (newImageURL.value) {
        try {
            const data = await fetch(newImageURL.value);
            const buffer = await data.arrayBuffer();
            const name = `${uuidv4()}.jpeg`;
            const response = await uploadService.uploadImage(buffer, name, 'olympsis-profile-images');
            if (response?.url) {
                update.imageURL = response.url.replace(/^olympsis-/, '');
            } else {
               throw('Failed to upload event image');
            }
        } catch (error) {
            viewState.value = VIEW_STATE.PENDING;
            const config = useRuntimeConfig();
            if (config.public.MODE !== 'dev') return;
            console.error(`Failed to upload image. Error: ${error}`);
            return;
        }
    }

    // Update user data
    try {
        const resp = await service.updateUserData(update)
        if (resp) {
            session.user = resp;
            viewState.value = VIEW_STATE.PENDING;
            emits('close');
        }
    } catch (error) {
        const config = useRuntimeConfig();
        if (config.public.MODE === 'dev') {
            viewState.value = VIEW_STATE.PENDING;
            console.error(`Failed to update user data. Error: ${error}`)
        }
    }
}

onMounted(() => {
    // Load in user data
    const user = session.user;
    if (!user) return;

    bio.value = user.bio ?? '';
    username.value = user.username ?? 'olympsis-user';
    user.sports.forEach((s) => {
        const found = session.sports.find((sp) => sp.name.includes(s));
        if (found) {
            userSports.value.push(found);
        }
    })

    if (user.imageURL) {
        profileImageURL.value = generateImageURL(user.imageURL);
    }
});
</script>

<style scoped>
#edit-profile-view {
    width: 100%;
    max-width: 35rem;
    border-radius: 15px;
    background-color: var(--primary-background-color);

    #header {
        display: flex;
        padding: 1rem;
        justify-content: space-between;

        button {
            border: unset;
            padding: 0.5rem;
            cursor: pointer;
            border-radius: 10px;
        }

        #save {
            color: white;
            padding-left: 0.75rem;
            padding-right: 0.75rem;
            background-color: var(--primary-brand-color);
        }
    }

    #body {
        margin: 0rem 1rem;

        #profile-image {
            display: flex;
            align-items: center;
            justify-content: center;

            img {
                width: 8rem;
                height: 8rem;
                cursor: pointer;
                border-radius: 50%;
            }

            #template {
                width: 8rem;
                height: 8rem;
                cursor: pointer;
                border-radius: 50%;
                background-color: var(--secondary-background-color);
            }
        }

        #username {
            input {
                width: 100%;
                height: 2rem;
                border: unset;
                font-size: 1rem;
                font-weight: 300;
                margin: 0.5rem 0rem;
                border-radius: 10px;
                padding: 0rem 0.5rem;
                background-color: var(--secondary-background-color);
            }
        }

        #bio {
            textarea {
                width: 100%;
                border: unset;
                padding: 0.5rem;
                font-weight: 300;
                max-height: 10rem;
                max-width: 23rem;
                font-size: 1rem;
                margin: 0.5rem 0rem;
                border-radius: 10px;
                background-color: var(--secondary-background-color);
            }
        }

        #hometown {
            button {
                width: 100%;
                height: 2rem;
                border: unset;
                cursor: pointer;
                margin: 0.5rem 0rem;
                border-radius: 10px;
                background-color: var(--secondary-background-color);
            }
        }
    }
}

.section {
    margin: 1rem 0rem;
}

.title {
    font-size: 1rem;
    font-weight: 300;
    color: var(--primary-label-color);
}

.sub-title {
    font-size: 0.8rem;
    font-weight: normal;
    color: var(--olympsis-gray);
}

#primary-action {
    .spinner-loader {
        width: 25px;
    }
}

#locale-modal {
    top: 0;
    border: unset;
    background: transparent;

    #locale-picker{
        border-radius: 20px;
        max-width: 25rem !important;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    }
}

#media-picker-modal{
    top: 5rem;
    width: 100%;
    border: unset;
    background: unset;
    position: absolute;
}
</style>