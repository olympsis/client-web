import { ref } from "vue";
import { defineStore } from "pinia";
import { VIEW_STATE } from "~/data/Enums";
import { Post } from "../data/models/PostModels";
import { useSessionStore } from "./session-store";
import { PostService } from "../data/services/PostService";
import { GroupSelection } from "../data/models/GenericModels";

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
            if (posts.value.length == 0) {
                loadNextPosts()
                .then((_posts) => {
                    posts.value = _posts;
                    state.value = VIEW_STATE.SUCCESS;
                    return
                })
                .catch((error) => {
                    console.error('Failed to load groups view model: ' + error);
                    state.value = VIEW_STATE.FAILED;
                    return
                })
            } else {
                state.value = VIEW_STATE.SUCCESS;
            }
        } else {
            // Wait half a second for the session store to propagate the changes
            setTimeout(() => {
                load();
            }, 500);
        }
    }

    async function loadNextPosts() : Promise<Post[]> {
        if (sessionStore.selectedGroup) {
            const id = sessionStore.selectedGroup?.club?.id ?? sessionStore.selectedGroup?.organization?.id
            const response = await postService.getPosts(id ?? '')
            if (response && response.posts) {
                return response.posts
            } else {
                return []
            }
        } else {
            return []
        }
    }

    function changeSelectedGroup(group: GroupSelection) {
        state.value = VIEW_STATE.LOADING
        sessionStore.selectedGroup = group
        loadNextPosts()
            .then((_posts) => {
                if (sessionStore.selectedGroup) {
                    posts.value = _posts;
                } else {
                    state.value = VIEW_STATE.FAILED
                    return
                }
                state.value = VIEW_STATE.SUCCESS
                return
            })
            .catch((error) => {
                console.error('Failed to load posts: ' + error)
                state.value = VIEW_STATE.FAILED
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
        changeSelectedGroup
    }
});