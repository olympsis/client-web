<template>
    <button id="group-visibility-button" @click="toggle">
        <img class="group-visibility-leading" v-if="model === GROUP_VISIBILITY.PUBLIC" src="@/assets/icons/globe/globe.white.svg"/>
        <img class="group-visibility-leading" v-if="model === GROUP_VISIBILITY.PRIVATE" src="@/assets/icons/trophy/trophy.white.svg"/>
        {{ model.valueOf() }}
        <img class="group-visibility-trailing" src="@/assets/icons/chevron/chevron.down.white.svg">
    </button>

    <Popover 
        ref="op" 
        id="group-visibility-popup" 
        :dismissable="true" 
        :pt="{ content: { style: { backgroundColor: 'var(--primary-background-color)', borderRadius: '5px' } } }"
    >
        <div id="popup-header"> Visibility </div>
        <div id="popup-body">
            <div class="option">
                <div class="header">
                    <div 
                        :class="{ selected: model === GROUP_VISIBILITY.PUBLIC, unselected: model !== GROUP_VISIBILITY.PUBLIC }" 
                        @click="pickOption(GROUP_VISIBILITY.PUBLIC)"/>
                    <h1>{{ GROUP_VISIBILITY.PUBLIC }}</h1>
                </div>
                <p class="body">Any users on Olympsis will be able to see this group and interact with it.</p>
            </div>

            <div class="option">
                <div class="header">
                    <div 
                        :class="{ selected: model === GROUP_VISIBILITY.PRIVATE, unselected: model !== GROUP_VISIBILITY.PRIVATE }" 
                        @click="pickOption(GROUP_VISIBILITY.PRIVATE)"
                    />
                    <h1>{{ GROUP_VISIBILITY.PRIVATE }}</h1>
                </div>
                <p class="body">Only users that are invited to join or apply can see this group and interact with it.</p>
            </div>
        </div>
    </Popover>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { GROUP_VISIBILITY } from '~/data/Enums';

import Popover from 'primevue/popover';

const op = ref();
const model = defineModel({ default: GROUP_VISIBILITY.PUBLIC })

const toggle = (event: any) => {
    op.value.toggle(event);
}

const pickOption = (option: any) => {
    model.value = option;
};
</script>

<style scoped>

#group-visibility-button {
    color: white;
    display: flex;
    border: unset;
    font-size: 0.8rem;
    align-items: center;
    border-radius: 10px;
    justify-content: center;
    text-transform: capitalize;
    background-color: var(--primary-brand-color);

    .group-visibility-leading {
        margin-right: 0.5rem;
    }

    .group-visibility-trailing {
        width: 1rem;
        height: 1rem;
        margin-top: 0.2rem;
        margin-left: 0.3rem;
    }
}

#group-visibility-popup {
    max-width: 15rem;
    background-color: var(--primary-background-color);

    #popup-header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-label-color);
    }

    #popup-body {
        max-width: 25rem;

        .option {
            height: 7rem;
            margin: 0.5rem 0rem;
            border-radius: 10px;
            padding: 0.5rem;
            background-color: var(--secondary-background-color);

            .header {
                display: flex;
                align-items: center;
                
                .selected {
                    width: 1rem;
                    height: 1rem;
                    cursor: pointer;
                    border-radius: 50%;
                    margin: 0rem 0.5rem;
                    background-color: var(--primary-label-color);
                }

                .unselected {
                    width: 1rem;
                    height: 1rem;
                    cursor: pointer;
                    border-radius: 50%;
                    margin: 0rem 0.5rem;
                    border: 2px solid var(--primary-label-color);
                }

                h1 {
                    font-size: 1rem;
                    font-weight: medium;
                    text-transform: capitalize;
                    color: var(--primary-label-color);
                }
            }

            .body {
                color: gray;
                font-size: 0.8rem;
                margin: 0.5rem;
            }
        }
    }
}

</style>