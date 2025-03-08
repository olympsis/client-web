import { ref } from "vue";
import { defineStore } from "pinia";
import { VIEW_STATE } from "~/data/Enums";
import { Post } from "../data/models/PostModels";
import { useSessionStore } from "./session-store";
import { PostService } from "../data/services/PostService";
import { GroupSelection } from "../data/models/GenericModels";
import type { Club } from "~/data/models/ClubModels";

export const useGroupsViewModel = defineStore('groups-view-model', () => {
    var state = ref(VIEW_STATE.LOADING);
    
    var sessionStore = useSessionStore();
    var postService = new PostService();

    var chatRooms = ref([]);
    var posts = ref<Post[]>([]);

    var orgApplications: any[] = [];
    var clubApplications: any[] = [];

    function load() {
        state.value = VIEW_STATE.LOADING;
        if (sessionStore.selectedGroup) {
            const id = sessionStore.selectedGroup.club?.id ?? sessionStore.selectedGroup.organization?.id
            if (!id) {
                state.value = VIEW_STATE.FAILURE;
                return;
            }
            loadNextPosts(id)
                .then((_posts) => {
                    posts.value = _posts;
                    state.value = VIEW_STATE.SUCCESS;
                    return;
                })
                .catch((error) => {
                    console.error('Failed to load groups view model: ' + error);
                    state.value = VIEW_STATE.FAILURE;
                    return;
                });
        } else {
            // Wait half a second for the session store to propagate the changes
            setTimeout(() => {
                load();
            }, 500);
        }
    }

    function loadPostsForClub(club: Club) {
        state.value = VIEW_STATE.LOADING;
        const id = club.id ?? '';
        loadNextPosts(id)
            .then((_posts) => {
                posts.value = _posts;
                state.value = VIEW_STATE.SUCCESS;
                return;
            })
            .catch((error) => {
                console.error('Failed to load groups view model: ' + error);
                state.value = VIEW_STATE.FAILURE;
                return;
            });
    }

    async function loadNextPosts(id: string) : Promise<Post[]> {
        const response = await postService.getPosts(id)
        if (response && response.posts) {
            state.value = VIEW_STATE.SUCCESS;
            return response.posts
        } else {
            state.value = VIEW_STATE.SUCCESS;
            return [];
        }
    }

    function changeSelectedGroup(group: GroupSelection) {
        state.value = VIEW_STATE.LOADING
        sessionStore.selectedGroup = group
        const id = group.club?.id ?? group.organization?.id
        if (!id) {
            state.value = VIEW_STATE.FAILURE
            return;
        }

        loadNextPosts(id)
            .then((_posts) => {
                if (sessionStore.selectedGroup) {
                    posts.value = _posts;
                } else {
                    state.value = VIEW_STATE.FAILURE
                    return
                }
                state.value = VIEW_STATE.SUCCESS
                return
            })
            .catch((error) => {
                console.error('Failed to load posts: ' + error)
                state.value = VIEW_STATE.FAILURE
            });
    }

    return {
        state,
        
        chatRooms,
        posts,

        orgApplications,
        clubApplications,

        load,
        loadNextPosts,
        loadPostsForClub,
        changeSelectedGroup
    }
});