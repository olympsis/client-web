<template>
    <div id="participants-peek">
        <h2>{{ participants.length + " Going" }}</h2>
        <ul id="participants">
            <li class="participant" v-for="participant in participants">
                <UserIcon 
                    :user="participant.user" 
                    :size="2" 
                    :style="{ 'height': '2.5rem' }"
                    :class="{ 'yes': participant.status === EVENT_RSVP_STATUS.YES, 'maybe': participant.status === EVENT_RSVP_STATUS.MAYBE }"
                />
                <div class="name">{{ participant.user?.username ?? 'olympsis-user' }}</div>
            </li>
        </ul>

        <div id="more" v-if="participants.length > 5" @click="$emit('show-participants')">{{ "+" + (participants.length - 5) + " More" }}</div>
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

const participants: ComputedRef<Array<Participant>> = computed(() => {
    // De-reference from event's participants array
    const array: Array<Participant> = props.event?.participants?.map((x) => x) ?? []
    const length = array.length;
    for (let i = 0; i < 5 - length; ++i) {
        let ptp: Participant = Participant.decode({
            'id': `${i}`,
            'status': 'maybe',
            'created_at': 0
        });
        if (ptp) {
            array.push(ptp)
        }
    }

    return array;
});

</script>

<style scoped>
#participants-peek {
    width: 100%;
    display: flex;
    margin-right: 1rem;
    overflow-x: scroll;
    flex-direction: column;

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