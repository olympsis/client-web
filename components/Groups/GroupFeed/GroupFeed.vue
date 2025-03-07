<template>
    <div id="feed">
        <Tabs value="0" scrollable>
            <TabList
            :pt="{ 
                activeBar: { 
                    style: { 
                        backgroundColor: 'var(--primary-brand-color)', height: '2.5px' 
                    } 
                } 
                }">
                <Tab value="0" class="font">Posts</Tab>
                <Tab value="1" class="font">Members</Tab>
                <Tab value="2" class="font">Events</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <PostFeed />
                </TabPanel>
                <TabPanel value="1">
                    <ClubMembers :club="club"/>
                </TabPanel>
                <TabPanel value="2">
                    
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>

<script setup lang="ts">
import Tab from 'primevue/tab';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import ClubMembers from '../ClubMembers/ClubMembers.vue';
import PostFeed from '~/components/Posts/PostFeed/PostFeed.vue';
import { Club } from '~/data/models/ClubModels';

defineProps({
   club: { type: Club, required: true } 
});
</script>

<style scoped>
#feed {
    width: 100vw;
    height: 90dvh;
    grid-area: feed;
    max-width: 35rem;
    padding: 0rem 1rem;
    overflow-x: scroll;
}
.font {
    font-size: 0.9rem;
    font-weight: normal;
}
.p-tab-active {
    font-weight: 500;
    color: var(--primary-label-color);
    border-color: var(--primary-brand-color);
}
.p-tab-panels {
    background: var(--primary-background-color);
}
.p-tablist-tab-list {
    background: var(--primary-background-color);
}
</style>