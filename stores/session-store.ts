import { defineStore } from 'pinia'
import * as Sentry from '@sentry/nuxt';

import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { useModelStore } from './model-store';
import { Club } from '~/data/models/ClubModels';
import { Event } from '~/data/models/EventModels';
import { Venue } from '~/data/models/VenueModels';
import { ChatRoom } from '~/data/models/ChatModels';
import { GROUP_TYPE, VIEW_STATE } from '~/data/Enums';
import { ChatService } from '~/data/services/ChatService';
import { ClubService } from '~/data/services/ClubService';
import { UserService } from '~/data/services/UserService';
import { VenueService } from '~/data/services/VenueService';
import { EventService } from '~/data/services/EventService';
import { CheckIn, UserData } from '~/data/models/UserModels';
import { Announcement } from '~/data/models/AnnouncementModels';
import { Organization } from '../data/models/OrganizationModels';
import { LocationManager } from '../data/managers/LocationManager';
import { OrganizationService } from '~/data/services/OrganizationService';
import { GroupSelection, Location, Sport, Tag } from '../data/models/GenericModels';

export const useSessionStore = defineStore('session-store', () => {

    var tags = ref<Tag[]>([]);
    var sports = ref<Sport[]>([]);

    var router = useRouter();
    var hasLoaded = ref(false);
    var location = new LocationManager();

    const authStore = useAuthStore();
    const modelStore = useModelStore();

    var clubService = new ClubService();
    var orgService = new OrganizationService();
    var venueService = new VenueService();
    var eventService = new EventService();
    var chatService = new ChatService();

    var user = ref<UserData | undefined>();

    var events = ref<Event[]>([]);
    var venues = ref<Venue[]>([]);
    var pastEvents = ref<Event[]>([]);
    var announcements = ref<Announcement[]>([]);
    
    var clubs = ref<Club[]>([]);
    var organizations = ref<Organization[]>([]);

    var groups = ref<GroupSelection[]>([]);
    var selectedGroup = ref<GroupSelection | undefined>();

    var chatRooms = ref<ChatRoom[]>([]);

    var loadingState = ref<VIEW_STATE>(VIEW_STATE.PENDING);
    var locationState = ref<VIEW_STATE>(VIEW_STATE.PENDING);
    var lastKnownLocation: Ref<Location | undefined> = ref(undefined);

    var mapkitToken: Ref<string | undefined> = ref(undefined);
    var mapKitServerToken: Ref<string | undefined> = ref(undefined);

    /**
     * Initializes the session by checking in user
     */
    async function init() {
        try {
            // Set app-wide loading state
            loadingState.value = VIEW_STATE.LOADING;

            const config = useRuntimeConfig();

            // Initialize auth if needed (auth store handles dev mode internally)
            if (!authStore.isAuthInitialized) {
                await authStore.initAuth();
            }

            // If auth failed, redirect to sign in (skip in dev mode)
            if (!authStore.isAuthenticated) {
                if (config.public.MODE !== 'dev') {
                    await navigateTo({ path: '/signin' });
                }
                return;
            }

            // Make Check In request to server
            const service = new UserService();
            const resp = await service.checkIn();
            if (!resp) throw('Failed to get check in data. Response from server is undefined.');

            // Log out user if we fail to get user data
            if (!resp.user) {
                await logout();
            }

            // Load in user data
            user.value = resp.user;

            // Load in Groups Data
            _loadGroupData(resp);

            // Set has loaded to true
            hasLoaded.value = true;
            loadingState.value = VIEW_STATE.SUCCESS;
        } catch (error) {
            Sentry.withScope((scope) => {
                scope.setExtra('action', 'check_in');
                Sentry.captureException(error);
            });
            loadingState.value = VIEW_STATE.FAILURE;
            console.error(`Failed to init session store. Checking in user failed. Error: ${error}`);
        }
    }

    /**
     * Loads in the venues and events near the user
     */
    async function loadVenuesAndEvents() {
        locationState.value = VIEW_STATE.LOADING;
        const coords = await location.getPositionWithTimeout();
        lastKnownLocation.value = coords.location;

        const store = useModelStore();
        const authStore = useAuthStore();
        
        // Define proper type for the event data response
        type EventDataResponse = { venues: Venue[], events: Event[] } | null;
        
        // Check if we can fetch venue/event data
        if (!authStore.isAuthenticated || !user.value?.sports || user.value?.sports.length === 0) {
            console.log('Skipping venue data fetch: User not authenticated or sports preferences not available');
            return;
        }
        
        try {
            // Get sports from user data - ensure it exists
            const sports = user.value?.sports.map((s) => s.valueOf()).join(',');
            
            // Fetch nearby data with user sports preferences
            const eventDataResponse = await eventService.getNearbyData(
                coords.location.latitude, 
                coords.location.longitude, 
                1000000, 
                sports
            ) as EventDataResponse;
            
            // Process venue and event data
            if (eventDataResponse) {
                const _venues = eventDataResponse.venues ?? [];
                const _events = eventDataResponse.events ?? [];
                
                store.setVenues(_venues);
                store.setEvents(_events);

                venues.value = _venues;
                events.value = _events;
            }

            locationState.value = VIEW_STATE.SUCCESS;
        } catch (error) {
            locationState.value = VIEW_STATE.FAILURE;
            console.error('Failed to fetch venues and events near user:', error);
        }
    }

    /**
     * Adds a new group to the session
     * 
     * @param group - the group to be added
     */
    function addGroup(group: GroupSelection) {
        if (groups.value) {
            groups.value.push(group);
        } else {
            groups.value = [group];
        }
        selectedGroup.value = group;
    }

    /**
     * Removes a group from the session
     * 
     * @param id - the group's id to remove
     */
    function removeGroup(id: string) {
        const index = groups.value.findIndex((g) => g.id === id );
        if (index !== -1) {
            groups.value.splice(index, 1);
            if (groups.value.length != 0) {
                selectedGroup.value = groups.value[0];
            } else {
                selectedGroup.value = undefined;
                router.push('/groups');
            }
        }
    }

    /**
     * Clears out the session data
     */
    function resetSession() {
        hasLoaded.value = false;
    }

    /**
     * Logs the user out and sends the browser back to signin
     */
    async function logout() {
        await authStore.signOut();
        await navigateTo('/signin');
    }

    /**
     * Deletes the user's account and sends the browser back to signin
     */
    async function deleteAccount() {
        await authStore.deleteAccount();
        await navigateTo('/signin');
    }

    /**
     * Load in the clubs and organizations into groups
     * Set the selected group from saved data or the first group in the list
     * 
     * @param data CheckIn data from the server
     */
    function _loadGroupData(data: CheckIn) {
        // Load in groups
        data.clubs?.forEach((c) => groups.value.push(new GroupSelection(GROUP_TYPE.CLUB, c, undefined)));
        data.organizations?.forEach((o) => groups.value.push(new GroupSelection(GROUP_TYPE.ORGANIZATION, undefined, o)));

        // Set Selected Group
        // TODO: - REMEMBER LAST SELECTED GROUP
        selectedGroup.value = groups.value.at(0);

        // Add club & organization data to model store
        if (data.clubs) modelStore.setClubs(data.clubs);
        if (data.organizations) modelStore.setOrganizations(data.organizations);
    }

    return {
        init,
        hasLoaded,
        user,
        
        tags,
        sports,

        events,
        pastEvents,

        venues,
        clubs,
        organizations,
        
        
        groups,
        selectedGroup,

        chatRooms,

        loadingState,
        locationState,
        announcements,
        lastKnownLocation,

        mapkitToken,
        mapKitServerToken,

        clubService,
        orgService,
        eventService,
        venueService,
        chatService,

        addGroup,
        removeGroup,

        resetSession,
        loadVenuesAndEvents,
        logout,
        deleteAccount
    }
});
