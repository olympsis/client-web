<template>
    <button id="event-skill-button" @click="toggle">
        <img class="event-skill-leading" src="@/assets/icons/star/star.white.svg"/>
        {{ model.valueOf() }}
        <img class="event-skill-trailing" src="@/assets/icons/chevron/chevron.down.white.svg">
    </button>

    <OverlayPanel 
        ref="op" 
        id="event-skill-popup" 
        :dismissable="true" 
        :pt="{ content: { style: { backgroundColor: 'var(--primary-background-color)', borderRadius: '5px' } } }"
    >
        <div id="popup-header"> Skill Levels </div>
        <div id="popup-body">
            <div class="option">
                <div class="header">
                    <div 
                        :class="{ selected: model === EVENT_SKILL_LEVEL.ANY_LEVEL, unselected: model !== EVENT_SKILL_LEVEL.ANY_LEVEL }" 
                        @click="pickOption(EVENT_SKILL_LEVEL.ANY_LEVEL)"/>
                    <h1>{{ EVENT_SKILL_LEVEL.ANY_LEVEL }}</h1>
                </div>
                <p class="body">All athletes on Olympsis regardless of skill level  are invited to attend this event.</p>
            </div>

            <div class="option">
                <div class="header">
                    <div 
                        :class="{ selected: model === EVENT_SKILL_LEVEL.AMATEUR, unselected: model !== EVENT_SKILL_LEVEL.AMATEUR }" 
                        @click="pickOption(EVENT_SKILL_LEVEL.AMATEUR)"
                    />
                    <h1>{{ EVENT_SKILL_LEVEL.AMATEUR }}</h1>
                </div>
                <p class="body">All athletes at a amateur skill level are invited to join this event. More skilled players can join if they want to. </p>
            </div>

            <div class="option">
                <div class="header">
                    <div 
                        :class="{ selected: model === EVENT_SKILL_LEVEL.INTERMEDIATE, unselected: model !== EVENT_SKILL_LEVEL.INTERMEDIATE }" 
                        @click="pickOption(EVENT_SKILL_LEVEL.INTERMEDIATE)"
                    />
                    <h1>{{ EVENT_SKILL_LEVEL.INTERMEDIATE }}</h1>
                </div>
                <p class="body">All athletes at an intermediate skill level are invited to join this event. More skilled players can join if the want to.</p>
            </div>

            <div class="option">
                <div class="header">
                    <div 
                        :class="{ selected: model === EVENT_SKILL_LEVEL.EXPERT, unselected: model !== EVENT_SKILL_LEVEL.EXPERT }" 
                        @click="pickOption(EVENT_SKILL_LEVEL.EXPERT)"
                    />
                    <h1>{{ EVENT_SKILL_LEVEL.EXPERT }}</h1>
                </div>
                <p class="body">Only athletes at an expert’s skill level are invited to join this event.</p>
            </div>
        </div>
    </OverlayPanel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { EVENT_SKILL_LEVEL } from '~/data/Enums';
import OverlayPanel from 'primevue/overlaypanel';

const op = ref();
const model = defineModel({ default: EVENT_SKILL_LEVEL.ANY_LEVEL })

const toggle = (event: any) => {
    op.value.toggle(event);
}

const pickOption = (option: any) => {
    model.value = option;
};
</script>

<style scoped>

#event-skill-button {
    color: white;
    display: flex;
    border: unset;
    font-size: 0.8rem;
    align-items: center;
    border-radius: 10px;
    justify-content: center;
    text-transform: capitalize;
    background-color: var(--primary-brand-color);

    .event-skill-leading {
        margin-right: 0.5rem;
    }

    .event-skill-trailing {
        width: 1rem;
        height: 1rem;
        margin-top: 0.2rem;
        margin-left: 0.3rem;
    }
}

#event-skill-popup {
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