<template>
    <button id="group-type-button" @click="toggle">
        <img class="group-type-leading" v-if="model === GROUP_TYPE.CLUB" src="@/assets/icons/group/group.fill.white.svg"/>
        <img class="group-type-leading" v-else src="@/assets/icons/building/building.white.svg"/>
        {{ model.valueOf() }}
        <img class="group-type-trailing" src="@/assets/icons/chevron/chevron.down.white.svg">
    </button>

    <OverlayPanel 
        ref="op" 
        id="group-type-popup" 
        :dismissable="true" 
        :pt="{ content: { style: { backgroundColor: 'var(--primary-background-color)', borderRadius: '5px' } } }"
    >
        <div id="popup-header"> Type </div>
        <div id="popup-body">
            <div class="option">
                <div class="header">
                    <div 
                        :class="{ selected: model === GROUP_TYPE.CLUB, unselected: model !== GROUP_TYPE.CLUB }" 
                        @click="pickOption(GROUP_TYPE.CLUB)"/>
                    <h1>{{ GROUP_TYPE.CLUB }}</h1>
                </div>
                <p class="body">A social circle uniting individuals who share a common interest in a sport or fitness goal. </p>
            </div>
            <div class="option">
                <div class="header">
                    <div 
                        :class="{ selected: model === GROUP_TYPE.ORGANIZATION, unselected: model !== GROUP_TYPE.ORGANIZATION }" 
                        @click="pickOption(GROUP_TYPE.ORGANIZATION)"
                    />
                    <h1>{{ GROUP_TYPE.ORGANIZATION }}</h1>
                </div>
                <p class="body">An organization is a generic structure for various clubs that share a common goal or owner.</p>
            </div>
        </div>
    </OverlayPanel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { GROUP_TYPE } from '~/data/Enums';
import OverlayPanel from 'primevue/overlaypanel';

const op = ref();
const model = defineModel({ default: GROUP_TYPE.CLUB })

const toggle = (event: any) => {
    op.value.toggle(event);
}

const pickOption = (option: any) => {
    model.value = option;
};
</script>

<style scoped>

#group-type-button {
    color: white;
    display: flex;
    border: unset;
    font-size: 0.8rem;
    align-items: center;
    border-radius: 10px;
    justify-content: center;
    text-transform: capitalize;
    background-color: var(--primary-brand-color);

    .group-type-leading {
        margin-right: 0.5rem;
    }

    .group-type-trailing {
        width: 1rem;
        height: 1rem;
        margin-top: 0.2rem;
        margin-left: 0.3rem;
    }
}

#group-type-popup {
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