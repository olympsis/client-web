<template>
    <div id="event-comments">
        <h2>Comments</h2>
        <div id="text-field">
            <textarea placeholder="Add a Comment"/>
            <button>Comment</button>
        </div>
        <ul id="comments">
            <li class="comment">

            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { Event } from '~/data/models/EventModels';

defineModel('event', {
    type: Event,
    required: true
});
</script>

<style scoped>
#event-comments {
    #text-field {
        width: 100%;
        display: flex;
        margin-top: 0.5rem;
        align-items: center;
        flex-direction: row;

        textarea {
            width: 100%;
            height: 2rem;
            border: unset;
            font-size: 1rem;
            min-height: 2rem;
            margin-right: 1rem;
            border-radius: 20px;
            padding: 0.4rem 0.75rem;
            background-color: var(--secondary-background-color);
        }

        button {
            height: 2rem;
            border: unset;
            color: white;
            font-weight: bold;
            padding: 0rem 1rem;
            border-radius: 20px;
            background-color: var(--primary-brand-color);
        }
    }
}
</style>