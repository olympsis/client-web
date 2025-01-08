<template>
    <div id="event-organizers-picker" @click="toggle">
        {{ displayText }}
    </div>

    <!-- Popup -->
    <OverlayPanel
        ref="op" 
        id="event-organizers-popup" 
        :dismissable="true"
        :pt="{ content: { style: { backgroundColor: 'var(--primary-background-color)', borderRadius: '5px' } } }"
    >
        <div id="organizers-header">
            <h1> Organizers </h1>
            <button @click="op.hide()">
                Done
            </button>
        </div>

        <ScrollPanel 
            id="organizers-list" 
            :style="{ height: '12rem' }"
        >
            <div v-for="group in availableGroups" class="organizer">
                <div 
                    :key="componentKey"
                    :class="{ selected: isSelected(group), button: true }" 
                    @click="toggleGroup(group)"
                />

                <div id="logo">
                    <img v-if="getGroupLogoURL(group)" :src="getGroupLogoURL(group)"/>
                    <div v-else class="template">
                        <picture v-if="group.type === GROUP_TYPE.CLUB">
                            <source srcset="@assets/icons/group/group.fill.white.svg" media="(prefers-color-scheme: dark)"/>
                            <img src="@assets/icons/group/group.fill.svg"/> 
                        </picture>
                        <picture v-else>
                            <source srcset="@assets/icons/building/building.white.svg" media="(prefers-color-scheme: dark)"/>
                            <img src="@assets/icons/building/building.svg"/> 
                        </picture>
                    </div>
                </div>
                {{ getGroupName(group) }}
            </div>
        </ScrollPanel>
    </OverlayPanel>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ComputedRef } from 'vue';
import { GROUP_TYPE } from '~/data/Enums';
import ScrollPanel from 'primevue/scrollpanel';
import { Club } from '~/data/models/ClubModels';
import OverlayPanel from 'primevue/overlaypanel';
import { generateImageURL } from '~/utils/Image';
import { useSessionStore } from '~/stores/session-store';
import { GroupSelection } from '~/data/models/GenericModels';
import { Organization } from '~/data/models/OrganizationModels';


const op = ref();
const toggle = (event: any) => {
    op.value.toggle(event);
    model.value = [];
    displayText.value = 'Select at least one Group'
}

const componentKey = ref(0);
const displayText = ref('Select at least one Group');
const model = defineModel<GroupSelection[]>({ default: [] });

const sessionStore = useSessionStore();
const availableGroups: ComputedRef<GroupSelection[]> = computed(() => {
    // Start For Storybook Testing
    // const club: Club = Club.decode({
    //     id: "slc-fc",
    //     parent: {
    //         id: "us-ysa-soccer",
    //         name: "US Youth Soccer Association",
    //         description:
    //         "The US Youth Soccer Association is the national governing body for youth soccer in the United States.",
    //         city: "Salt Lake City",
    //         state: "UT",
    //         country: "USA",
    //     },
    //     name: "SLC FC",
    //     description:
    //         "SLC FC is a youth soccer club based in Salt Lake City, Utah. We provide a positive and competitive environment for players to develop their skills and love for the game.",
    //     sport: "Soccer",
    //     city: "Salt Lake City",
    //     state: "UT",
    //     country: "USA",
    //     imageURL: "https://example.com/slcfc-logo.png",
    //     imageGallery: [
    //         "https://example.com/slcfc-team1.jpg",
    //         "https://example.com/slcfc-team2.jpg",
    //         "https://example.com/slcfc-field.jpg",
    //     ],
    //     visibility: "public",
    //     members: [
    //         {
    //         id: "john.doe",
    //         name: "John Doe",
    //         role: "player",
    //         },
    //         {
    //         id: "jane.smith",
    //         name: "Jane Smith",
    //         role: "coach",
    //         },
    //     ],
    //     rules: [
    //         "Respect your teammates, coaches, and opponents.",
    //         "Always give your best effort.",
    //         "Have fun and enjoy the game!",
    //     ],
    //     pinnedPostId: "announcement-123",
    //     createdAt: 1619827200000,
    // });

    // const club2: Club = Club.decode({
    //     id: "mfc-utah",
    //     parent: {
    //         id: "us-ysa-soccer",
    //         name: "US Youth Soccer Association",
    //         description:
    //         "The US Youth Soccer Association is the national governing body for youth soccer in the United States.",
    //         city: "Salt Lake City",
    //         state: "UT",
    //         country: "USA",
    //     },
    //     name: "MFC",
    //     description:
    //         "MFC (Murray Football Club) is a youth soccer organization based in Murray, Utah. Our mission is to provide a supportive environment for players to develop their skills and passion for the game.",
    //     sport: "Soccer",
    //     city: "Murray",
    //     state: "UT",
    //     country: "USA",
    //     imageURL: "https://example.com/mfc-logo.png",
    //     imageGallery: [
    //         "https://example.com/mfc-team1.jpg",
    //         "https://example.com/mfc-team2.jpg",
    //         "https://example.com/mfc-field.jpg",
    //     ],
    //     visibility: "public",
    //     members: [
    //         {
    //         id: "alex.rodriguez",
    //         name: "Alex Rodriguez",
    //         role: "player",
    //         },
    //         {
    //         id: "sarah.wilson",
    //         name: "Sarah Wilson",
    //         role: "coach",
    //         },
    //     ],
    //     rules: [
    //         "Respect your teammates, coaches, and opponents.",
    //         "Always give your best effort on and off the field.",
    //         "Have fun and enjoy the beautiful game!",
    //     ],
    //     pinnedPostId: "announcement-456",
    //     createdAt: 1619827200000,
    // });

    // const org: Organization = Organization.decode({
    //     id: "us-ysa-soccer",
    //     name: "US Youth Soccer Association",
    //     description:
    //         "The US Youth Soccer Association is the national governing body for youth soccer in the United States.",
    //     sport: "Soccer",
    //     city: "Salt Lake City",
    //     state: "UT",
    //     country: "USA",
    //     imageURL: "https://example.com/usysasoccer-logo.png",
    //     imageGallery: [
    //         "https://example.com/usysasoccer-event1.jpg",
    //         "https://example.com/usysasoccer-event2.jpg",
    //         "https://example.com/usysasoccer-team.jpg",
    //     ],
    //     members: [
    //         {
    //         id: "john.smith",
    //         name: "John Smith",
    //         role: "president",
    //         },
    //         {
    //         id: "jane.doe",
    //         name: "Jane Doe",
    //         role: "vice-president",
    //         },
    //     ],
    //     pinnedPostId: "announcement-789",
    //     children: [
    //         {
    //         id: "slc-fc",
    //         name: "SLC FC",
    //         description:
    //             "SLC FC is a youth soccer club based in Salt Lake City, Utah.",
    //         sport: "Soccer",
    //         city: "Salt Lake City",
    //         state: "UT",
    //         country: "USA",
    //         },
    //         {
    //         id: "mfc-utah",
    //         name: "MFC",
    //         description:
    //             "MFC (Murray Football Club) is a youth soccer organization based in Murray, Utah.",
    //         sport: "Soccer",
    //         city: "Murray",
    //         state: "UT",
    //         country: "USA",
    //         },
    //     ],
    //     createdAt: 1483228800000,
    // });

    // const groups = [
    //     new GroupSelection(GROUP_TYPE.CLUB, club, undefined),
    //     new GroupSelection(GROUP_TYPE.CLUB, club2, undefined),
    //     new GroupSelection(GROUP_TYPE.ORGANIZATION, undefined, org)
    // ]
    // return groups;
    // End of Storybook Testing Info

    return sessionStore.groups;
});

function getGroupName(group: GroupSelection) : string {
    switch (group.type) {
        case GROUP_TYPE.CLUB:
            return group.club?.name ?? 'olympsis-group'
        case GROUP_TYPE.ORGANIZATION:
            return group.organization?.name ?? 'olympsis-group'
    }
}

function getGroupLogoURL(group: GroupSelection) : string | undefined {
    switch (group.type) {
        case GROUP_TYPE.CLUB:
            return group.club?.logo ? generateImageURL(group.club?.logo) : undefined
        case GROUP_TYPE.ORGANIZATION:
            return group.organization?.logo ? generateImageURL(group.organization?.logo) : undefined
    }
}

function toggleGroup(group: GroupSelection) {
    const index = model.value.findIndex((g) => g.id === group.id);
    if (index != -1) {
        model.value.splice(index, 1);
    } else {
        model.value.push(group);
    }
    componentKey.value += 1;
    displayText.value = generateDisplayString();
}

function isSelected(group: GroupSelection) : boolean {
    return model.value.findIndex((g) => { return g.id === group.id }) !== -1
}

function generateDisplayString() {
    if (model.value.length == 1) {
        const group = model.value[0].club ?? model.value[0].organization
        return group?.name ?? 'olympsis-group';
    } else if (model.value.length == 2) {
        const group1 = model.value[0].club ?? model.value[0].organization
        const group2 = model.value[1].club ?? model.value[1].organization
        return `${group1?.name ?? 'olympsis-group'} & ${group2?.name ?? 'olympsis-group'}`
    } else if (model.value.length > 2) {
        const group = model.value[0].club ?? model.value[0].organization
        return `${group?.name ?? 'olympsis-group'} & ${model.value.length - 1} others`
    } else {
        return 'Select at least one Group';
    }
}
</script>

<style scoped>
#event-organizers-picker {
    height: 2.5rem;
    display: flex;
    font-size: 0.9rem;
    cursor: pointer;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
    color: var(--primary-label-color);
    background-color: var(--tertiary-background-color);
}

#event-organizers-popup {

    #organizers-header {
        h1 {
            font-size: 1rem;
            color: var(--primary-label-color);
        }

        button {
            border: unset;
            color: white;
            cursor: pointer;
            border-radius: 5px;
            margin: 0rem 1rem;
            padding: 0.25rem 0.6rem;
            background-color: var(--primary-brand-color);
        }

        display: flex;
        justify-content: space-between;
    }

    #organizers-list {
        
        .organizer {
            display: flex;
            align-items: center;
            margin: 1rem 1rem 1rem 0rem;
            color: var(--primary-label-color);

            .button {
                width: 1rem;
                height: 1rem;
                cursor: pointer;
                border-radius: 50%;
                margin: 0rem 0.7rem;
                border: 2px solid var(--primary-label-color);
            }

            .selected {
                border: unset;
                background-color: var(--primary-label-color);
            }

            #logo {
                width: 3rem;
                height: 3rem;
                display: flex;
                margin-right: 1rem;
                border-radius: 50%;
                align-items: center;
                justify-content: center;
                background-color: var(--secondary-background-color);

                img {
                    width: 3rem;
                    height: 3rem;
                    display: flex;
                    border-radius: 50%;
                }
            }
        }
    }
}
</style>