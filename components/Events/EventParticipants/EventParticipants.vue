<template>
    <div id="participants-peek">
        <UserIcon 
            v-for="participant in participants" 
            :user="participant.user" 
            :size="3" 
            :style="{ 'height': '3.5rem' }"
            :class="{ 'yes': participant.status === EVENT_RSVP_STATUS.YES, 'maybe': participant.status === EVENT_RSVP_STATUS.MAYBE }"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue';
import { Event } from '@/data/models/EventModels';
import { Participant } from '@/data/models/GenericModels';

import UserIcon from '@/components/UserIcon/UserIcon.vue';
import { EVENT_RSVP_STATUS } from '~/data/Enums';

const props = defineProps({
    event: Event
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

    * {
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