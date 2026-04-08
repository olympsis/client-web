<template>
    <div id="event-organizers">
        <h2>Hosted by</h2>
        <ul id="list">
            <ParticipantListItem v-if="!event.config?.hidePoster" :participant="poster"/>

            <li v-for="organizer in organizers" class="organizer">
                <GroupBadge :type="organizer.type" :imageURL="organizer.imageURL" :size="2.5" />
                <div id="name">{{ organizer.name }}</div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { Club } from '~/data/models/ClubModels';
import { Event } from '~/data/models/EventModels';
import { UserSnippet } from '~/data/models/UserModels';
import { Organization } from '~/data/models/OrganizationModels';
import { Organizer, Participant } from '~/data/models/GenericModels';


import GroupBadge from '~/components/Groups/GroupBadge/GroupBadge.vue';
import ParticipantListItem from '../ParticipantListItem/ParticipantListItem.vue';

const props = defineProps({
    event: { type: Event, required: true },
    clubs: { type: Array<Club>, required: true },
    organizations: { type: Array<Organization>, required: true }
});

const poster = computed<Participant>(() => {
    let snippet = new UserSnippet(
        props.event.poster?.userId,
        props.event.poster?.firstName,
        props.event.poster?.lastName,
        props.event.poster?.username,
        props.event.poster?.imageURL
    );
    return Participant.decode({
        'id': `${111}`,
        'status': 1,
        'user': snippet.encode(),
        'created_at': Date.now() 
    });
});

const organizers = computed<Array<{ type: number, name: String, imageURL: string }>>(() => {
    let _organizers: Array<{ type: number, name: string, imageURL: string }> = []
    props.event.organizers.forEach((o: Organizer) => {
        if (o.type == 'CLUB') {
            const club = props.clubs.find((c) => c.id == o.id);
            if (club) {
                _organizers.push({ type: 0, name: club.name ?? 'Olympsis Club', imageURL: club.logo ?? '' })
            }
        } else {
            const org = props.organizations.find((og) => og.id == o.id);
            if (org) {
                _organizers.push({ type: 1, name: org.name ?? 'Olympsis Organization', imageURL: org.logo ?? '' })
            }
        }
    });
    return _organizers;
});
</script>

<style scoped>
#event-organizers {
    grid-area: host;
    
    #list {
        padding: 0;
        margin-top: 0.5rem;
        margin-left: 0.5rem;
        list-style-type: none;

        li {
            margin: 0.5rem 0rem;
        }
    }

    #poster {
        #user-icon {
            border: var(--olympsis-light-gray) solid 2px;
        }
    }

    .organizer {
        display: flex;
        align-items: center;
        list-style-type: none;

        #name {
            font-weight: bold;
            margin-left: 0.5rem;
        }
    }
}
</style>