<template>
    <div id="participants-peek">
        <h2>{{ event.participants.length + " Going" }}</h2>
        <ul id="participants">
            <li class="participant" v-for="participant in event.participants">
                <UserIcon 
                    :user="participant.user" 
                    :size="2" 
                    :style="{ 'height': '2.5rem' }"
                    :class="{ 'yes': participant.status === EVENT_RSVP_STATUS.YES, 'maybe': participant.status === EVENT_RSVP_STATUS.MAYBE }"
                />
                <div class="name">{{ participant.user?.username ?? 'olympsis-user' }}</div>
            </li>
        </ul>

        <div id="more" v-if="event.participants.length > 5" @click="$emit('show-participants')">{{ "+" + (event.participants.length - 5) + " More" }}</div>
    </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue';
import { EVENT_RSVP_STATUS } from '~/data/Enums';
import { Event } from '@/data/models/EventModels';
import { Participant } from '@/data/models/GenericModels';

import UserIcon from '@/components/UserIcon/UserIcon.vue';

const props = defineProps({
    event: { type: Event, required: true }
});

</script>

<style scoped>
#participants-peek {
    overflow-x: scroll;
    flex-direction: column;
    grid-area: participants;

    #participants {
        padding: 0rem;
        list-style-type: none;

        .participant {
            display: flex;
            flex-direction: row;
            align-items: center;

            .name {
                font-weight: bold;
                margin-left: 2rem;
            }
        }
    }

    #more {
        font-weight: bold;
    }

    * {
        width: fit-content;
        margin-top: 0.25rem;
        margin-right: -1.5rem;
    }

    .yes {
        border: 0.25rem solid var(--primary-brand-color);
    }

    .maybe {
        border: 0.25rem solid var(--secondary-brand-color);
    }
}
</style>