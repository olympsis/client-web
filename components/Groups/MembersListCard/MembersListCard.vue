<template>
    <div class="selector-wrapper">
        <ul id="members-list" >
            <li v-for="member in members"><MemberListItem :member="member" style="margin: 1rem 0rem;"/></li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { Member } from '~/data/models/GenericModels';
import MemberListItem from '../MemberListItem/MemberListItem.vue';

const props = defineProps<{
    members: Member[]
}>()

</script>

<style scoped>
.selector-wrapper {
    width: 25rem;
    height: 20rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    border-radius: 10px;
    background-color: var(--secondary-background-color);

    .group-view {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 1rem 0rem;

        .name {
            margin: 0rem 1rem;
            font-weight: 600;
        }
    }

    #members-list {
        width: 100%;
        margin: 0rem;
        height: 20rem;
        padding: 0rem 1rem;
        overflow-y: scroll;
        list-style-type: none;
    }
}
</style>