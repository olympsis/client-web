<template>
    <div id="event-hosts-card">
        <!-- Posted by -->
        <div id="poster-section">
            <h4>Posted by</h4>
            <div class="user-row">
                <UserIcon :user="poster" :size="2.5"/>
                <span class="name">{{ posterName }}</span>
            </div>
        </div>

        <!-- Organizers section (visible when organizers have been added) -->
        <div v-if="organizers.length > 0" class="section">
            <div class="divider"></div>

            <h4>Organizers</h4>
            <div class="section-content">
                <div class="items-list">
                    <div v-for="(org, i) in organizers" :key="i" class="item-row">
                        <div class="badge-wrapper">
                            <GroupBadge :type="org.type" :imageURL="org.imageURL" :size="2.5" />
                            <!-- Red X overlay for removing an organizer -->
                            <button v-if="removable" class="remove-badge" @click="emit('removeOrganizer', i)">
                                <img src="@/assets/icons/xmark/xmark.red.svg" />
                            </button>
                        </div>
                        <span class="name">{{ org.name }}</span>
                    </div>
                </div>
                <button class="action-btn" @click="emit('addOrganizers')">
                    <picture>
                        <source srcset="@/assets/icons/group/group.white.svg" media="(prefers-color-scheme: dark)" />
                        <img src="@/assets/icons/group/group.svg" />
                    </picture>
                    <span>Add Organizers</span>
                </button>
            </div>
        </div>

        <!-- Sponsors section (visible when sponsors have been added) -->
        <div v-if="sponsors.length > 0" class="section">
            <div class="divider"></div>
            
            <h4>Sponsors</h4>
            <div class="section-content">
                <div class="items-list">
                    <div v-for="(sponsor, i) in sponsors" :key="i" class="item-row">
                        <div class="badge-wrapper">
                            <GroupBadge :type="1" :imageURL="sponsor.imageURL" :size="2.5" />
                            <!-- Red X overlay for removing a sponsor -->
                            <button v-if="removable" class="remove-badge" @click="emit('removeSponsor', i)">
                                <img src="@/assets/icons/xmark/xmark.red.svg" />
                            </button>
                        </div>
                        <span class="name">{{ sponsor.name }}</span>
                    </div>
                </div>
                <button class="action-btn" @click="emit('addSponsors')">
                    <picture>
                        <source srcset="@/assets/icons/building/building.white.svg" media="(prefers-color-scheme: dark)" />
                        <img src="@/assets/icons/building/building.svg" />
                    </picture>
                    <span>Add Sponsors</span>
                </button>
            </div>
        </div>

        <!-- Bottom action buttons for sections that don't have items yet -->
        <div v-if="!organizers.length || !sponsors.length" id="actions-row">
            <button v-if="!organizers.length" class="action-btn" @click="emit('addOrganizers')">
                <picture>
                    <source srcset="@/assets/icons/group/group.white.svg" media="(prefers-color-scheme: dark)" />
                    <img src="@/assets/icons/group/group.svg" />
                </picture>
                <span>Add Organizers</span>
            </button>
            <button v-if="!sponsors.length" class="action-btn" @click="emit('addSponsors')">
                <picture>
                    <source srcset="@/assets/icons/building/building.white.svg" media="(prefers-color-scheme: dark)" />
                    <img src="@/assets/icons/building/building.svg" />
                </picture>
                <span>Add Sponsors</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { UserSnippet } from '~/data/models/UserModels';

import UserIcon from '~/components/UserIcon/UserIcon.vue';
import GroupBadge from '~/components/Groups/GroupBadge/GroupBadge.vue';

export interface OrganizerItem {
    type: number; // 0 = club, 1 = organization
    name: string;
    imageURL?: string;
}

export interface SponsorItem {
    name: string;
    imageURL?: string;
}

const props = defineProps<{
    poster?: UserSnippet;
    organizers: OrganizerItem[];
    sponsors: SponsorItem[];
    /** Shows remove badges on organizer/sponsor items */
    removable?: boolean;
}>();

const emit = defineEmits<{
    (e: 'addOrganizers'): void;
    (e: 'addSponsors'): void;
    (e: 'removeOrganizer', index: number): void;
    (e: 'removeSponsor', index: number): void;
}>();

/** Falls back to "John Doe" when no poster is provided */
const posterName = computed<string>(() => {
    if (!props.poster) return 'John Doe';
    const first = props.poster.firstName ?? '';
    const last = props.poster.lastName ?? '';
    return `${first} ${last}`.trim() || props.poster.username || 'John Doe';
});
</script>

<style scoped>
#event-hosts-card {
    padding: 1rem;
    margin: 1rem 0rem;
    border-radius: 20px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--component-border-color);
    background-color: var(--component-background-color);
}

h4 {
    margin-bottom: 0.5rem;
    color: var(--primary-label-color);
}

/* Posted by section — avatar + name row */
.user-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .name {
        font-weight: 700;
        font-size: 1.1rem;
        color: var(--primary-label-color);
    }
}

/* Shared section layout (Organizers / Sponsors) */
.section {
    .divider {
        height: 1.5px;
        margin: 0.75rem 0;
        background-color: var(--olympsis-light-gray);
    }
}

/* Row holding the items list and the "Add …" button */
.section-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
}

/* Badge + name for each organizer / sponsor */
.item-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;

    .name {
        font-weight: 700;
        font-size: 1.1rem;
        color: var(--primary-label-color);
    }
}

/* Wrapper that positions the red X badge over the group/sponsor icon */
.badge-wrapper {
    position: relative;
    display: inline-flex;

    .remove-badge {
        all: unset;
        cursor: pointer;
        position: absolute;
        top: -4px;
        right: -4px;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background-color: var(--secondary-background-color);

        img {
            width: 12px;
            height: 12px;
        }
    }
}

/* Pill-shaped action buttons (Add Organizers / Add Sponsors) */
.action-btn {
    all: unset;
    gap: 0.4rem;
    display: flex;
    cursor: pointer;
    align-items: center;
    border-radius: 20px;
    padding: 0.4rem 0.75rem;
    color: var(--primary-label-color);
    border: 1px solid var(--component-border);
    background-color: var(--secondary-background-color);
    font-size: 0.85rem;

    picture {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    img {
        width: 1.2rem;
        height: 1.2rem;
    }

    &:hover {
        background-color: var(--tertiary-background-color);
    }
}

/* Bottom row of action buttons when sections are empty */
#actions-row {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.75rem;
    flex-wrap: wrap;
}
</style>
