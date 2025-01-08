<template>
    <div id="no-group-warning">
        <svg id="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M84-877 876-85l-57 57-44-44q-20 15-44 23.5T680-40H402q-30 0-56-13.5T303-92L48-465l24-23q19-19 45-22t47 12l116 81v-150L27-820l57-57Zm756 643L600-473v-367q0-17 11.5-28.5T640-880q17 0 28.5 11.5T680-840v367h80v-287q0-17 11.5-28.5T800-800q17 0 28.5 11.5T840-760v526ZM520-554l-80-80v-246q0-17 11.5-28.5T480-920q17 0 28.5 11.5T520-880v326ZM360-714l-80-80v-6q0-17 11.5-28.5T320-840q17 0 28.5 11.5T360-800v86Z"/></svg>
        <h1> Cannot Create Event </h1>
        <div> Please join or create a group before creating a new event. </div>
        <button @click="$emit('close')"> Ok </button>
    </div>
</template>

<style scoped>
    #no-group-warning {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;

        height: 18rem;
        max-width: 32rem;
        margin: 0rem 2rem;

        svg {
            width: auto;
            height: 2rem;
            margin: 0.5rem 0rem;
            color: var(--primary-brand-color);
        }

        h1 {
            font-size: 1.2rem;
            margin-bottom: 1rem;
        }

        div {
            color: gray;
            font-size: 0.9rem;
            text-align: center;
        }

        button {
            width: 55%;
            border: unset;
            color: white;
            cursor: pointer;
            height: 2.25rem;
            font-size: 1rem;
            margin: 2rem 0rem;
            border-radius: 10px;
            background-color: var(--primary-brand-color);
        }
    }
</style>