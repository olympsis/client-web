<template>
    <header id="navigation-bar">
        <RouterLink to="/" id="logo"/>
       
        <div id="web-routes" class="routes">
            <RouterLink to="/" activeClass="route-selected" class="route">
                <div class="home"/>
            </RouterLink>

            <RouterLink to="/groups" activeClass="route-selected" class="route">
                <div class="group" />
            </RouterLink>

            <RouterLink to="/events" activeClass="route-selected" class="route">
                <div class="events" />
            </RouterLink>

            <RouterLink to="/chats" activeClass="route-selected" class="route">
                <div class="chats" />
            </RouterLink>
        </div>

        <div id="mobile-routes" class="routes">
            <RouterLink to="/" activeClass="route-selected" class="route">
                <div class="home"/>
            </RouterLink>

            <RouterLink to="/groups" activeClass="route-selected" class="route">
                <div class="group" />
            </RouterLink>

            <RouterLink to="/events" activeClass="route-selected" class="route">
                <div class="events" />
            </RouterLink>

            <RouterLink to="/chats" activeClass="route-selected" class="route">
                <div class="chats" />
            </RouterLink>

            <RouterLink to="/profile" class="profile">
                <ProfileButton :imageURL="userImageURL"/>
            </RouterLink>
        </div>

        <RouterLink id="web-profile" to="/profile" class="profile">
            <ProfileButton :imageURL="userImageURL"/>
        </RouterLink>
    </header>
</template>

<script setup lang="ts">

import { ref, computed } from 'vue';
import { generateImageURL } from '~/utils/Image';
import { useSessionStore } from '~/stores/session-store';

import ProfileButton from '~/components/ProfileButton/ProfileButton.vue';

const session = useSessionStore();

const userImageURL = computed(() => {
    return session.user?.imageURL ? generateImageURL(session.user.imageURL) : undefined;
});

var isOpen = ref(false);

function toggleMenu() {
    isOpen.value = !isOpen.value;
}

function hideMenu() {
    isOpen.value = false;
}

</script>

<style scoped>
#navigation-bar {
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    width: 100%;
    display: flex;
    max-height: 60px;
    min-height: 60px;
    position: sticky;
    position: -webkit-sticky;
    padding: 0rem 1rem;
    align-items: center;
    justify-content: space-between;
    background-color: var(--primary-brand-color);

    #logo {
        width: 40px;
        height: 40px;
        min-width: 40px;
        margin: 0rem 1rem;
        border-radius: 5px;
        background-size: 40px;
        background-image: url('@/assets/logo/logo-black.png');
    }

    #mobile-routes {
        display: none;
    }

    .routes {
        width: 100%;
        display: flex;
        min-width: 12rem;
        max-width: 25rem;
        align-items: center;
        justify-content: space-between;
    }

    .profile {
        margin-right: 1rem;
        align-items: center;
        justify-content: center;
    }
}

@media (max-width: 940px) {
    .container {

        #web-routes {
            display: none;
        }
        
        #mobile-routes {
            display: flex;
        }
        
        #web-profile {
            display: none;
        }

        .routes {
            min-width: none;
            max-width: none;
        }
        a {
            margin: 0rem auto !important;
        }
    }
    #logo {
        display: none;
    }
}

#trailing {
    display: flex;
    align-items: center;
}

.route {
    display: flex;
    margin: 0rem 2rem;
    align-items: center;
    flex-direction: column;

    .label {
        color: white;
        font-size: 0.65rem;
        font-weight: normal;
        text-transform: uppercase;
    }

    .home {
        width: 35px;
        height: 40px;
        background-size: 35px 40px;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('@/assets/icons/home/home.svg');
    }

    .group {
        width: 40px;
        height: 40px;
        background-size: 40px;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('@/assets/icons/group/group.svg');
    }

    .events {
        width: 40px;
        height: 40px;
        background-size: 33px;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('@/assets/icons/calendar/calendar.white.svg');
    }

    .chats {
        width: 40px;
        height: 40px;
        background-size: 40px;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('@/assets/icons/bubble2/bubble.2.white.svg');
    }
}

.route-selected {
    display: flex;
    margin: 0rem 2rem;
    align-items: center;
    flex-direction: column;
    
    .label {
        color: white;
        font-size: 0.65rem;
        font-weight: normal;
        text-transform: uppercase;
    }

    .home {
        width: 35px;
        height: 40px;
        background-size: 35px 40px;
        background-image: url('@/assets/icons/home/home.fill.svg');
    }

    .group {
        width: 40px;
        height: 40px;
        background-size: 40px;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('@/assets/icons/group/group.fill.white.svg');
    }

    .events {
        width: 40px;
        height: 40px;
        background-size: 33px;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('@/assets/icons/calendar/calendar.fill.white.svg');
    }


    .chats {
        width: 40px;
        height: 40px;
        background-size: 40px;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('@/assets/icons/bubble2/bubble.2.fill.white.svg');
    }
}

.chats {
    width: 30px;
    height: 30px;
    cursor: pointer;
    margin-top: 0.4rem;
    margin-right: 0.5rem;
    background-size: 30px;
    background-position: center;
    background-image: url('@/assets/icons/bubble2/bubble.2.svg');
}

.chats-selected {
    width: 30px;
    height: 30px;
    cursor: pointer;
    margin-top: 0.4rem;
    margin-right: 0.5rem;
    background-size: 30px;
    background-position: center;
    background-image: url('@/assets/icons/bubble2/bubble.2.fill.svg');
}

.notifications {
    width: 35px;
    height: 35px;
    cursor: pointer;
    margin-right: 0.5rem;
    background-size: 30px;
    background-position: center;
    background-image: url('@/assets/icons/bell/bell.svg');
}

.notifications-selected {
    width: 35px;
    height: 35px;
    cursor: pointer;
    background-size: 30px;
    background-position: center;
    background-image: url('@/assets/icons/bell/bell.fill.svg');
}

.chats-selected {
    width: 35px;
    height: 35px;
    cursor: pointer;
    background-size: 30px;
    background-position: center;
    background-image: url('@/assets/icons/bubble2/bubble.2.fill.svg');
}
</style>