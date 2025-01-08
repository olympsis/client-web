<template>
    <div id="loading-text-button">
        <div v-if="state === VIEW_STATE.PENDING" id="text-button-pending">
            <div id="content">{{ props.text }}</div>
        </div>
        <div v-if="state === VIEW_STATE.LOADING" id="text-button-loading">
            <div class="dots-loader"></div>
        </div>
        <div v-if="state === VIEW_STATE.SUCCESS" id="text-button-success">
            <div id="content">{{ successText }}</div>
        </div>
        <div v-if="state === VIEW_STATE.FAILED" id="text-button-failed">
            <div id="content">{{ failureText }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { VIEW_STATE } from '~/data/Enums';

const props = defineProps({
   text: { type: String , required: true },
   successText: { type: String },
   failureText: { type: String }
});

const state = defineModel<VIEW_STATE>({
    required: true
});
</script>

<style scoped>
#loading-text-button {
    width: 100%;
    height: 2.25rem;
    display: flex;
    cursor: pointer;
    font-size: 1rem;
    align-items: center;
    justify-content: center;
    border-radius: var(--button-border-radius);
    background-color: var(--primary-brand-color);

    #text-button-pending {
        #content {
            color: white;
        }
    }

    #text-button-loading {
        .loader {
            width: 60px;
            aspect-ratio: 2;
            --_g: no-repeat radial-gradient(circle closest-side,white 90%,#0000);
            background: 
                var(--_g) 0%   50%,
                var(--_g) 50%  50%,
                var(--_g) 100% 50%;
            background-size: calc(100%/3) 25%;
            animation: l3 1s infinite linear;
        }

        @keyframes l3 {
            20%{background-position:0%   0%, 50%  50%,100%  50%}
            40%{background-position:0% 100%, 50%   0%,100%  50%}
            60%{background-position:0%  50%, 50% 100%,100%   0%}
            80%{background-position:0%  50%, 50%  50%,100% 100%}
        }
    }

    #text-button-success {
        #content {
            color: green;
        }
    }

    #text-button-failed {
        #content {
            color: red;
        }
    }
}
</style>