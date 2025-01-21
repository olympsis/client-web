<template>
    <div id="event-participants-list-modal">
        <div id="header">
            <h1>Participants</h1>

            <button class="button" @click="$emit('close')">
                <picture class="centered">
                    <source srcset="@/assets/icons/xmark/xmark.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/xmark/xmark.svg">
                </picture>
            </button>
        </div>
        
        <ul id="participants-list" v-if="event.participants.length > 0">
            <li v-for="participant in event.participants" class="participant">
                <div class="info">
                    <UserIcon 
                        :size="3"
                        :user="participant.user"
                    />
                    <div>{{ participant.user?.username }}</div>
                </div>
                <div class="response">{{ participant.status }}</div>
            </li>
        </ul>

        <ul id="wait-list" v-if="event.waitList.length > 0">
            <div id="label">Wait List</div>
            <li v-for="participant in event.waitList" class="participant">
                <div class="info">
                    <UserIcon 
                        :size="3"
                        :user="participant.user"
                    />
                    <div>{{ participant.user?.username }}</div>
                </div>
                <div class="response">{{ participant.status }}</div>
            </li>
        </ul>

        <div v-if="event.participants.length === 0 && event.waitList.length === 0" id="no-participants">
            No Participants
        </div>
    </div>
</template>

<script setup lang="ts">
import { Event } from '@/data/models/EventModels';
import UserIcon from '@/components/UserIcon/UserIcon.vue';

defineProps({
    event: { type: Event, required: true }
});
</script>

<style scoped>
#event-participants-list-modal {
    min-width: 20rem;
    border-radius: 20px;
    max-width: var(--dialog-max-width);
    background-color: var(--primary-background-color);

    #header {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0.5rem 1rem;
        justify-content: space-between;

        h1 {
            font-size: 1rem;
            font-weight: normal;
            white-space: nowrap;
            margin: auto;
            color: var(--primary-label-color);
        }
    }

    #participants-list {
        margin: 0rem;
        max-height: 25rem;
        overflow-y: scroll;
        padding: 0.5rem 0rem;
        list-style-type: none;

        .participant {
            display: flex;
            margin: 0.5rem 1rem;
            align-items: center;

            .info {
                display: flex;
                align-items: center;
                color: var(--primary-label-color);

                #user-icon {
                    margin-right: 0.5rem;
                }
            }

            .response {
                width: 100%;
                text-align: end;
                justify-content: flex-end;
                text-transform: capitalize;
                color: var(--primary-label-color);
            }

            .yes {
                border: 0.25rem solid var(--primary-brand-color);
            }

            .maybe {
                border: 0.25rem solid var(--secondary-brand-color);
            }
        }
    }

    #wait-list {
        margin: 0rem;
        max-height: 25rem;
        overflow-y: scroll;
        padding: 0.5rem 0rem;
        list-style-type: none;

        #label {
            width: 100%;
            height: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            background-color: var(--tertiary-brand-color);
        }

        .participant {
            display: flex;
            margin: 0.5rem 1rem;
            align-items: center;

            .info {
                display: flex;
                align-items: center;
                color: var(--primary-label-color);

                #user-icon {
                    margin-right: 0.5rem;
                }
            }

            .response {
                width: 100%;
                text-align: end;
                justify-content: flex-end;
                text-transform: capitalize;
                color: var(--primary-label-color);
            }

            .yes {
                border: 0.25rem solid var(--primary-brand-color);
            }

            .maybe {
                border: 0.25rem solid var(--secondary-brand-color);
            }
        }
    }

    #no-participants {
        width: 100%;
        margin: auto;
        color: gray;
        margin: 1rem 0rem;
        text-align: center;
        font-style: italic;
        vertical-align: middle;
    }

    .centered {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>