<template>
    <div class="container">
        <UserIcon :user="member.user" :size="3"/>
        <a class="name">{{ member.user?.username ?? 'olympsis-user' }}</a>
    </div>
</template>

<script setup lang="ts">
import { Member } from '~/data/models/GenericModels';
import UserIcon from '@/components/UserIcon/UserIcon.vue';

const props = defineProps<{
    member: Member
}>()

</script>

<style scoped>
.container {
    display: flex;
    cursor: pointer;
    flex-direction: row;
    align-items: center;

    .name {
        font-size: 1.3rem;
        margin: 0rem 1rem;
        color: var(--primary-label-color);
    }
}
</style>