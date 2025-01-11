<template>
    <button id="event-type-button" @click="toggle">
        <img class="event-type-leading" v-if="model === EVENT_TYPE.REGULAR" src="@/assets/icons/hexagon/hexagon.white.svg"/>
        <img class="event-type-leading" v-else src="@/assets/icons/trophy/trophy.white.svg"/>
        {{ model.valueOf() }}
        <img class="event-type-trailing" src="@/assets/icons/chevron/chevron.down.white.svg">
    </button>

    <Popover 
        ref="op" 
        id="event-type-popup" 
        :dismissable="true" 
        :pt="{ content: { style: { backgroundColor: 'var(--primary-background-color)', borderRadius: '5px' } } }"
    >
        <div id="popup-header"> Type </div>
        <div id="popup-body">
            <div class="option">
                <div class="header">
                    <div 
                        :class="{ selected: model === EVENT_TYPE.REGULAR, unselected: model !== EVENT_TYPE.REGULAR }" 
                        @click="pickOption(EVENT_TYPE.REGULAR)"/>
                    <h1>{{ EVENT_TYPE.REGULAR }}</h1>
                </div>
                <p class="body">An informal event, where people can attend without prior registration. Pick ups, meets etc... </p>
            </div>
            <div class="option">
                <div class="header">
                    <div 
                        :class="{ selected: model === EVENT_TYPE.COMPETITIVE, unselected: model !== EVENT_TYPE.COMPETITIVE }" 
                        @click="pickOption(EVENT_TYPE.COMPETITIVE)"
                    />
                    <h1>{{ EVENT_TYPE.COMPETITIVE }}</h1>
                </div>
                <p class="body">A structured event where individuals or teams compete to determine a winner or to gain a prize. Tournaments, brackets etc...</p>
            </div>
        </div>
    </Popover>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import Popover from 'primevue/popover';
import { EVENT_TYPE } from '~/data/Enums';

const op = ref();
const model = defineModel({ default: EVENT_TYPE.REGULAR })

const toggle = (event: any) => {
    op.value.toggle(event);
}

const pickOption = (option: any) => {
    model.value = option;
};
</script>

<style scoped>

#event-type-button {
    color: white;
    display: flex;
    border: unset;
    font-size: 0.8rem;
    align-items: center;
    border-radius: 10px;
    justify-content: center;
    text-transform: capitalize;
    background-color: var(--primary-brand-color);

    .event-type-leading {
        margin-right: 0.5rem;
    }

    .event-type-trailing {
        width: 1rem;
        height: 1rem;
        margin-top: 0.2rem;
        margin-left: 0.3rem;
    }
}

#event-type-popup {
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