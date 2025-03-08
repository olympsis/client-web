<template>
    <div id="group-members-peek">
        <UserIcon 
            v-for="member in members.slice(0, 5)" 
            :user="member.user" 
            :size="2.5" 
            class="user"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue';
import { Member } from '@/data/models/GenericModels';

import UserIcon from '@/components/UserIcon/UserIcon.vue';

const props = defineProps({
    members: { type: Array<Member> }
});

const members: ComputedRef<Member[]> = computed(() => {
    // De-reference from event's participants array
    const array: Member[] = props.members?.map((x) => x) ?? []
    const length = array.length;
    for (let i = 0; i < 5 - length; ++i) {
        let ptp: Member = Member.decode({
            'id': `${i}`,
            'role': 'member',
            'joined_at': Math.floor(Date.now() / 1000)
        });
        if (ptp) {
            array.push(ptp)
        }
    }

    return array;
});

</script>

<style scoped>
#group-members-peek {
    width: 100%;
    display: flex;
    margin-right: 1rem;

    * {
        margin-right: -1.5rem;
    }

    .user {
        height: 3rem;
        border: 0.25rem solid var(--primary-brand-color);
    }
}
</style>