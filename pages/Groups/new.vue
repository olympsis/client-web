<template>
    <div id="new-group-view">
        <div id="left">
            <!-- Header -->
            <div id="header">
                <button class="button" :style="{ marginRight: '1rem' }" @click="handleBackNavigation">
                    <picture class="centered">
                        <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/chevron/chevron.left.svg"/>
                    </picture>
                </button>
            </div>

            <!-- Config -->
            <div id="group-type-config">
                <GroupTypePicker v-model:model-value="groupType" />
                <div class="spacer"/>
                <GroupVisibilityPicker v-if="groupType === GROUP_TYPE.CLUB" v-model:model-value="groupVisibility"/>
            </div>

            <!-- Title -->
            <input id="group-title" type="text" placeholder="New Group" v-model="groupTitle" class="text-input"/>

            <BannerAndLogoEditor
                v-model:logo-url="groupLogo"
                v-model:banner-url="groupBanner"
            />

            <!-- Sports Picker -->
            <div id="group-sports-picker" :class="{ 'group-section': true, required: newGroupError === NEW_GROUP_ERROR.NO_SPORTS }">
                <div id="label"> Group Sports <div class="asterisk">*</div> </div>
                <div id="sub-label"> The sport(s) your group will focus on </div>
                <MultiSportsPicker v-model:model-value="groupSports" :multi-select="true"/>
            </div>
        </div>
        <div id="right">

            <!-- Description -->
            <div 
                id="group-description" 
                :class="{ 'group-section': true, required: newGroupError === NEW_GROUP_ERROR.NO_DESCRIPTION }"
                :style="{ marginTop: '2.5rem' }"
            >
                <div id="label"> Description <div class="asterisk">*</div> </div>
                <div id="sub-label"> What is your group about? </div>
                <textarea type="text" v-model="groupDescription" class="text-large"/>
            </div>

            <!-- Hometown Picker -->
            <div id="group-hometown" :class="{ 'group-section': true, 'dialog': true, required: newGroupError === NEW_GROUP_ERROR.NO_HOMETOWN }">
                <div id="label"> Hometown <div class="asterisk">*</div> </div>
                <div id="sub-label"> Where does your group call home? </div>
                <div class="text-input hometown-label"  @click="handleOpenHometownDialog" >
                    <div>{{ groupLocationString }}</div>
                </div>

                <dialog ref="hometown-dialog" id="hometown-dialog">
                    <LocalePicker :show-cities="true" @close="handleCloseHometownDialog" @completed="handleLocaleCompleted"/>
                </dialog>
            </div>

            <!-- Primary Action -->
            <div id="action-wrapper">
                <BoldTextButton v-model="state" text="create group" @click="createNewGroup"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { GROUP_TYPE } from '~/data/Enums';
import { Club } from '@/data/models/ClubModels';
import { useSessionStore } from '@/stores/session-store';
import { GroupSelection } from '@/data/models/GenericModels';
import { computed, ref, useTemplateRef, type Ref } from 'vue';
import { Organization } from '@/data/models/OrganizationModels';
import { GROUP_VISIBILITY, SPORTS, VIEW_STATE } from '~/data/Enums';
import { NewGroupManager, NEW_GROUP_ERROR } from '@/data/managers/NewGroupManager';

import LocalePicker from '@/components/LocalePicker/LocalePicker.vue';
import MultiSportsPicker from '@/components/MultiSportsPicker/MultiSportsPicker.vue';
import GroupTypePicker from '~/components/Groups/New Group/GroupTypePicker/GroupTypePicker.vue';
import BannerAndLogoEditor from '@/components/Events/BannerAndLogoEditor/BannerAndLogoEditor.vue';
import BoldTextButton from '@/components/Buttons/LoadingButtons/BoldTextButton/BoldTextButton.vue';
import GroupVisibilityPicker from '~/components/Groups/New Group/GroupVisibilityPicker/GroupVisibilityPicker.vue';

const session = useSessionStore();

const toast = useToast();
const router = useRouter();
const emit = defineEmits(['close']);
const state: Ref<VIEW_STATE> = ref(VIEW_STATE.PENDING);
const manager: NewGroupManager = new NewGroupManager();
const newGroupError: Ref<NEW_GROUP_ERROR | null> = ref(null);

const groupType: Ref<GROUP_TYPE> = ref(GROUP_TYPE.CLUB);
const groupVisibility: Ref<GROUP_VISIBILITY> = ref(GROUP_VISIBILITY.PUBLIC);

const groupTitle: Ref<string> = ref('');
const groupLogo: Ref<string> = ref('');
const groupBanner: Ref<string> = ref('');
const groupDescription: Ref<string> = ref('');

const groupSports: Ref<Array<SPORTS>> = ref([ SPORTS.RUNNING ]);
const groupLocation: Ref<{
    subAdministrativeArea: string,
    administrativeArea: string,
    country: string
} | undefined> = ref(undefined);

const groupLocationString = computed<string>(() => {
    if (groupLocation.value) {
        return `${groupLocation.value.subAdministrativeArea}, ${groupLocation.value.administrativeArea} (${groupLocation.value.country})`
    }
    return '';
});

const hometownDialog = useTemplateRef<HTMLDialogElement>('hometown-dialog');

function handleBackNavigation() {
    router.push('/groups/settings');
}

function handleOpenHometownDialog() {
    if (hometownDialog.value) {
        hometownDialog.value.show();
    } else {
        console.error('Failed to find reference of hometown dialog html element.');
    }
}

function handleCloseHometownDialog() {
    hometownDialog.value?.close();
}

function handleLocaleCompleted(event: any) {
    if (hometownDialog.value) {
        if (event) {
            groupLocation.value = {
                country: event.country,
                administrativeArea: event.state,
                subAdministrativeArea: event.city
            };
        }
        hometownDialog.value.close();
    } else {
        console.error('Failed to find reference of hometown dialog html element.');
    }
}

function createNewGroup() {
    state.value = VIEW_STATE.LOADING;

    try {
        const isInvalid = manager.validateNewGroupData(
            groupTitle.value,
            groupDescription.value,
            groupSports.value,
            groupLocation.value
        );
        
        if (isInvalid != null) {
            newGroupError.value = isInvalid;
            state.value = VIEW_STATE.PENDING;
        } else {
            newGroupError.value = null;
            if (groupLocation.value !== undefined) {
                const data = manager.generateNewGroupData(
                    groupType.value,
                    groupVisibility.value,
                    groupLogo.value,
                    groupBanner.value,
                    groupTitle.value,
                    groupSports.value,
                    groupDescription.value,
                    groupLocation.value
                );

                if (data) {
                    manager.createNewGroup(data)
                        .then((id: string | null) => {
                            if (id) {
                                state.value = VIEW_STATE.SUCCESS;
                                const object = manager.generateNewEventModel(id, data);
                                if (object instanceof Club) {
                                    const group = new GroupSelection(
                                        GROUP_TYPE.CLUB,
                                        object,
                                        undefined
                                    );
                                    session.addGroup(group);
                                    router.push('/groups');
                                } else if (object instanceof Organization) {
                                    const group = new GroupSelection(
                                        GROUP_TYPE.ORGANIZATION,
                                        undefined,
                                        object
                                    )
                                    session.addGroup(group);
                                    router.push('/groups');
                                }
                            } else {
                                throw('No ID returned by the server.')
                            }
                        })
                        .catch((error: any) => {
                            state.value = VIEW_STATE.FAILURE;
                            console.error(`Failed to create group. Error ${error}`);
                            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create group!', life: 3000 });
                        });
                }
            }
        }
    } catch {
        state.value = VIEW_STATE.FAILURE;
        setTimeout(() => {
            state.value = VIEW_STATE.PENDING;
        }, 500);
    }
}
</script>

<style scoped>
#new-group-view {
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: var(--primary-background-color);

    #left {
        width: 100%;
        display: flex;
        max-width: 30rem;
        flex-direction: column;
    }

    #right {
        width: 100%;
        display: flex;
        max-width: 30rem;
        margin-left: 2rem;
        flex-direction: column;

        #action-wrapper {
            margin-top: 5rem;
        }
    }
}

@media (max-width: 1030px) {
#new-group-view {
    width: 100%;
    display: flex;
    flex-direction: column;

    #left {
        width: 100%;
        margin: 0 auto;
    }

    #right {
        width: 100%;
        margin: 0 auto;

        #action-wrapper {
            margin-bottom: 10rem;
        }
    }
}
}

#header {
    display: flex;
    padding: 1rem;
    justify-content: space-between;

    h1 {
        font-size: 1rem;
        font-style: italic;
        text-transform: uppercase;
        color: var(--primary-label-color);
    }
}

#group-type-config {
    display: flex;
    margin: 1rem;
    
    .spacer {
        margin: 0rem 0.5rem;
    }
}

#group-title {
    height: 3rem;
    border: unset;
    font-size: 2.5rem;
    font-weight: bold;
    padding: 0rem 1rem;
    background-color: var(--primary-background-color);
}

.button {
    all: unset;
    cursor: pointer;
    padding: 0.5rem;
    height: fit-content;
    border-radius: 10px;
    background-color: var(--secondary-background-color);

    &:hover {
        transform: scale(1.1);
    }
}

.centered {
    display: flex;
    align-items: center;
    justify-content: center;
}

#note {
    font-size: 0.8rem;
    font-style: italic;
    margin: 0.2rem 1rem;
    color: var(--tertiary-brand-color);
}

#hometown-dialog {
    top: 50%;
    margin: auto;
    border: unset;
    padding: unset;
    border-radius: 20px;
}

.group-section {
    margin: 1rem;

    #label {
        display: flex;
        color: var(--primary-label-color);
    }

    #sub-label {
        color: gray;
        font-size: 0.8rem;
        margin-bottom: 0.4rem;
    }

    .text-input {
        width: 94%;
        height: 2.5rem;
        border: unset;
        font-size: 1.3rem;
        padding: 0rem 0.5rem;
        border-radius: 10px;
        color: var(--primary-label-color);
        background-color: var(--tertiary-background-color);
    }

    .text-large {
        width: 100%;
        height: 6rem;
        border: unset;
        padding: 0.5rem;
        font-size: 1.3rem;
        border-radius: 10px;
        color: var(--primary-label-color);
        background-color: var(--tertiary-background-color);
    }

    .hometown-label {
        display: flex;
        align-items: center;
    }
}

.required {
    border: 1px solid red;
}

.asterisk {
    color: var(--tertiary-brand-color);
}

#sub-title {
    color: gray;
    margin: 0rem 1rem;
    font-size: 0.9rem;
    font-style: italic;
}
</style>