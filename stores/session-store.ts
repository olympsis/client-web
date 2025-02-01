import {
    type Auth, 
} from 'firebase/auth';

import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router';
import { useModelStore } from './model-store';
import { Club } from '~/data/models/ClubModels';
import { Event } from '~/data/models/EventModels';
import { Venue } from '~/data/models/VenueModels';
import { UserData } from '~/data/models/UserModels';
import type { ChatRoom } from '~/data/models/ChatModels';
import { ChatService } from '~/data/services/ChatService';
import { AuthService } from '~/data/services/AuthService';
import { ClubService } from '~/data/services/ClubService';
import { UserService } from '~/data/services/UserService';
import { VenueService } from '~/data/services/VenueService';
import { EventService } from '~/data/services/EventService';
import { Organization } from '../data/models/OrganizationModels';
import { AUTH_STATUS, GROUP_TYPE, VIEW_STATE } from '~/data/Enums';
import { LocationManager } from '../data/managers/LocationManager';
import { GroupSelection, Location } from '../data/models/GenericModels';
import { AuthenticationFacade } from '@/data/facades/AuthenticationFacade';
import { OrganizationService } from '~/data/services/OrganizationService';

export const useSessionStore = defineStore('session-store', () => {

    var router = useRouter();
    var hasLoaded = ref(false);
    var hasLocation = ref(false);
    var location = new LocationManager();

    var authenticator = new AuthenticationFacade();

    var userService = new UserService();
    var clubService = new ClubService();
    var orgService = new OrganizationService();
    var venueService = new VenueService();
    var eventService = new EventService();
    var chatService = new ChatService();

    var user = ref<UserData | undefined>();

    var events = ref<Event[]>([]);
    var venues = ref<Venue[]>([]);

    var clubs = ref<Club[]>([]);
    var organizations = ref<Organization[]>([]);

    var groups = ref<GroupSelection[]>([]);
    var selectedGroup = ref<GroupSelection | undefined>();

    var chatRooms = ref<ChatRoom[]>([]);

    var lastKnownLocation: Ref<Location | undefined> = ref(undefined);
    var authStatus: Ref<AUTH_STATUS> = ref(AUTH_STATUS.unknown);
    var loadingState: Ref<VIEW_STATE> = ref(VIEW_STATE.PENDING);

    var mapkitToken: Ref<string | undefined> = ref(undefined);
    var mapKitServerToken: Ref<string | undefined> = ref(undefined); 

    var announcements: Ref<string[]> = ref([
        "https://storage.googleapis.com/olympsis-feed-images/072bb74c-bebe-449d-9d1f-efe26b974081.jpg",
        "https://storage.googleapis.com/olympsis-feed-images/89b037d3-e4d6-4e65-86a4-27ef09983489.jpg"
    ]);
    
    function checkAuthorizationStatus() {
        const nuxtApp = useNuxtApp();
        const auth = nuxtApp.$auth as Auth;
        const session = useSessionStore();
        const unsubscribe = auth.onAuthStateChanged(async (_user) => {
            if (_user) { // We only load data if there is no user data in memory and we get user update
                try {
                    load()
                        .then((response: {
                            user: UserData | undefined, 
                            selections: GroupSelection[],
                            selectedGroup: GroupSelection | undefined, 
                            hasLoaded: boolean, 
                            clubs: Club[], 
                            organizations: Organization[],
                        }) => {
                            session.$patch({
                                authStatus: AUTH_STATUS.authenticated,
                                loadingState: VIEW_STATE.SUCCESS,
                                user: response.user,
                                groups: response.selections,
                                selectedGroup: response.selectedGroup,
                                hasLoaded: response.hasLoaded,
                                clubs: response.clubs,
                                organizations: response.organizations,
                            });
                        });
                } catch(error) {
                     // We will most likely need to restart/reload the page.
                     // So we unsubscribe if we fail here.
                    unsubscribe();
                    console.error(error);
                    session.$patch({
                        authStatus: AUTH_STATUS.unauthenticated,
                        loadingState: VIEW_STATE.FAILURE
                    });
                }
            } else {
                // User needs to login.
                // We don't want the auth listener right now
                unsubscribe();
                session.$patch({
                    authStatus: AUTH_STATUS.unauthenticated,
                    loadingState: VIEW_STATE.SUCCESS
                });
            }
        }, (error) => {
            // We will most likely need to restart/reload the page.
            // So we unsubscribe if we fail here.
            unsubscribe();
            session.$patch({
                authStatus: AUTH_STATUS.unknown,
                loadingState: VIEW_STATE.FAILURE
            });
            console.error(`Failed to check user status. Error: ${error}`);
        });
    }

    function addGroup(group: GroupSelection) {
        if (groups.value) {
            groups.value.push(group);
        } else {
            groups.value = [group];
        }
        selectedGroup.value = group;
    }

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

    async function requestLocation(): Promise<boolean> {
        const resp = await location.requestLocationPermission();
        if (resp == 'denied') { return false; }
        return true;
    }

    async function load(): Promise<{ 
        user: UserData | undefined, 
        selections: GroupSelection[],
        selectedGroup: GroupSelection | undefined, 
        hasLoaded: boolean, 
        clubs: Club[], 
        organizations: Organization[],
    }> {
        const store = useModelStore();
        const response = await userService.checkIn()

        location.listenToLocationUpdates();
        
        const _clubs: Club[] = response?.clubs ?? [];
        const _organizations: Organization[] = response?.organizations ?? [];
        const _groups: GroupSelection[] = [];

        // load in clubs
        _clubs.forEach((c) => {
            const group = new GroupSelection(GROUP_TYPE.CLUB, c, undefined)
            _groups.push(group)
        });
        

        // load in organizations
        _organizations.forEach((o) => {
            const group = new GroupSelection(GROUP_TYPE.ORGANIZATION, undefined, o)
            _groups.push(group)
        });

        store.setClubs(_clubs);
        store.setOrganizations(_organizations);

        return {
            user: response?.user,
            selections: _groups,
            selectedGroup: _groups[0],
            hasLoaded: true,
            clubs: _clubs,
            organizations: _organizations,
            
        }
    }

    /**
     * Logs the user out and sends the browser back to signin
     */
    async function logout() {
        await authenticator.signOut();
        await navigateTo('/signin');
    }

    /**
     * Deletes the user's account and sends the browser back to signin
     */
    async function deleteAccount() {
        await authenticator.deleteAccount();
        await navigateTo('signin');
    }

    return {
        hasLoaded,
        hasLocation,
        user,
        events,
        venues,
        clubs,
        organizations,
        
        
        groups,
        selectedGroup,

        chatRooms,

        authStatus,
        loadingState,
        announcements,
        lastKnownLocation,

        mapkitToken,
        mapKitServerToken,

        userService,
        clubService,
        orgService,
        eventService,
        venueService,
        chatService,

        addGroup,
        removeGroup,

        load,
        logout,
        deleteAccount,
        requestLocation,
        checkAuthorizationStatus
    }
});
