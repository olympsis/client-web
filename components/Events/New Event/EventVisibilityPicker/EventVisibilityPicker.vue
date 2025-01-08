<template>
    <button id="event-visibility-button" @click="toggle">
        <img class="event-visibility-leading" v-if="model === EVENT_VISIBILITY.PUBLIC" src="@assets/icons/globe/globe.white.svg"/>
        <img class="event-visibility-leading" v-if="model === EVENT_VISIBILITY.GROUPS" src="@assets/icons/group/group.fill.white.svg"/>
        <img class="event-visibility-leading" v-if="model === EVENT_VISIBILITY.PRIVATE" src="@assets/icons/trophy/trophy.white.svg"/>
        {{ model.valueOf() }}
        <img class="event-visibility-trailing" src="@assets/icons/chevron/chevron.down.white.svg">
    </button>

    <OverlayPanel 
        ref="op" 
        id="event-visibility-popup" 
        :dismissable="true" 
        :pt="{ content: { style: { backgroundColor: 'var(--primary-background-color)', borderRadius: '5px' } } }"
    >
        <div id="popup-header"> Visibility </div>
        <div id="popup-body">
            <div class="option">
                <div class="header">
                    <div 
                        :class="{ selected: model === EVENT_VISIBILITY.PUBLIC, unselected: model !== EVENT_VISIBILITY.PUBLIC }" 
                        @click="pickOption(EVENT_VISIBILITY.PUBLIC)"/>
                    <h1>{{ EVENT_VISIBILITY.PUBLIC }}</h1>
                </div>
                <p class="body">Any users on Olympsis will be able to see this event and interact with it.</p>
            </div>

            <div class="option">
                <div class="header">
                    <div 
                        :class="{ selected: model === EVENT_VISIBILITY.GROUPS, unselected: model !== EVENT_VISIBILITY.GROUPS }" 
                        @click="pickOption(EVENT_VISIBILITY.GROUPS)"
                    />
                    <h1>{{ EVENT_VISIBILITY.GROUPS }}</h1>
                </div>
                <p class="body">Only members of the associated groups will be able to see and interact with this event. A user may be explicitly invited to RSVP to this event.</p>
            </div>

            <div class="option">
                <div class="header">
                    <div 
                        :class="{ selected: model === EVENT_VISIBILITY.PRIVATE, unselected: model !== EVENT_VISIBILITY.PRIVATE }" 
                        @click="pickOption(EVENT_VISIBILITY.PRIVATE)"
                    />
                    <h1>{{ EVENT_VISIBILITY.PRIVATE }}</h1>
                </div>
                <p class="body">An Event that is only visible to those who have been invited  to RSVP and to those who have already RSVP’ed. </p>
            </div>
        </div>
    </OverlayPanel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { EVENT_VISIBILITY } from '~/data/Enums';
import OverlayPanel from 'primevue/overlaypanel';

const op = ref();
const model = defineModel({ default: EVENT_VISIBILITY.PUBLIC })

const toggle = (event: any) => {
    op.value.toggle(event);
}

const pickOption = (option: any) => {
    model.value = option;
};
</script>

<style scoped>

#event-visibility-button {
    color: white;
    display: flex;
    border: unset;
    font-size: 0.8rem;
    align-items: center;
    border-radius: 10px;
    justify-content: center;
    text-transform: capitalize;
    background-color: var(--primary-brand-color);

    .event-visibility-leading {
        margin-right: 0.5rem;
    }

    .event-visibility-trailing {
        width: 1rem;
        height: 1rem;
        margin-top: 0.2rem;
        margin-left: 0.3rem;
    }
}

#event-visibility-popup {
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