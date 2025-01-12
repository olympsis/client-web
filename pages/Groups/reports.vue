<template>
    <main id="group-reports-view">
        <!-- Header -->
        <div id="header">
            <button @click="router.push('/groups/settings')">
                <picture>
                    <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/chevron/chevron.left.svg"
                </picture>
            </button>

            <h1> Reports </h1>
        </div>

        <ul id="reports-list">
            <div id="no-reports" v-if="reports.length == 0">
                No Reports Found
            </div>
        </ul>
    </main>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';

const router = useRouter();
const reports: Ref<any[]> = ref([]);

useSeoMeta({
    title: () => 'Group Reports | Olympsis',
    ogTitle: () => 'Group Reports | Olympsis',
    description: 'Join groups around the sports you love!',
    ogDescription: 'Join groups around the sports you love'
});

</script>

<style scoped>
#group-reports-view {
    width: 100%;
    display: flex;
    margin: 0 auto;
    overflow-y: scroll;
    align-items: center;
    flex-direction: column;

    #header {
        
        width: 100%;
        display: flex;
        max-width: 25rem;
        margin: 1rem 0rem;
        grid-area: header;
        flex-direction: row;
        align-items: center;

        .button {
            margin: 0rem 1rem;

            picture {
                width: 100%;
                height: 100%;
            }
        }

        button {
            all: unset;
            cursor: pointer;
        }

        h1 {
            margin: auto;
            max-width: 40vw;
            overflow: hidden;
            font-size: 1.2rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: var(--primary-label-color);
        }
    }

    #reports-list {

        #no-reports {
            width: 100%;
            height: 10rem;
            margin-top: 5rem;
            text-align: center;
        }
    }
}
</style>