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
                    <PostFeed ref="feed"/>
                </TabPanel>
                <TabPanel value="1">
                    <ClubMembers :club="club"/>
                </TabPanel>
                <TabPanel value="2">
                    <ClubEvents :club="club"/>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>

<script setup lang="ts">
import { Club } from '~/data/models/ClubModels';

import Tab from 'primevue/tab';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import ClubEvents from '../Clubs/ClubEvents/ClubEvents.vue';
import ClubMembers from '../Clubs/ClubMembers/ClubMembers.vue';
import PostFeed from '~/components/Posts/PostFeed/PostFeed.vue';

const props = defineProps({
   club: { type: Club, required: true } 
});

const feed = useTemplateRef<typeof PostFeed>('feed');
onMounted(() => {
    feed.value?.loadPostsForClub(props.club);
});
</script>

<style scoped>
#feed {
    width: 100vw;
    grid-area: feed;
    max-width: 35rem;
    padding: 0rem 1rem;
    overflow-x: scroll;
}
@media(max-width: 940px) {
    #feed {
        max-width: unset;
    }
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