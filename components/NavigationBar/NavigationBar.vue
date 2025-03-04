<template>
    <header id="navigation-bar">
        <NuxtLink to="/home" id="logo">
            OLYMPSIS
        </NuxtLink>
       
        <div id="web-routes" class="routes">
            <NuxtLink to="/home" activeClass="route-selected" class="route"> Dashboard </NuxtLink>

            <NuxtLink to="/groups" activeClass="route-selected" class="route"> Groups </NuxtLink>

            <NuxtLink to="/events" activeClass="route-selected" class="route"> Events </NuxtLink>

            <!-- <NuxtLink to="/rooms" activeClass="route-selected" class="route">
                <div class="chats" />
            </NuxtLink> -->
        </div>

        <div id="mobile-routes" class="routes">
            <NuxtLink to="/home" activeClass="route-selected" class="route">
                <div class="home"/>
            </NuxtLink>

            <NuxtLink to="/groups" activeClass="route-selected" class="route">
                <div class="group" />
            </NuxtLink>

            <NuxtLink to="/events" activeClass="route-selected" class="route">
                <div class="events" />
            </NuxtLink>

            <!-- <NuxtLink to="/rooms" activeClass="route-selected" class="route">
                <div class="chats" />
            </NuxtLink> -->

            <NuxtLink to="/profile" class="profile">
                <ProfileButton :imageURL="userImageURL"/>
            </NuxtLink>
        </div>

        <NuxtLink id="web-profile" to="/profile" class="profile">
            <ProfileButton :imageURL="userImageURL"/>
        </NuxtLink>
    </header>
</template>

<script setup lang="ts">

import { ref, computed } from 'vue';
import { generateImageURL } from '~/utils/image-helpers';
import { useSessionStore } from '~/stores/session-store';

import ProfileButton from '~/components/ProfileButton/ProfileButton.vue';

const isOpen = ref(false);
const session = useSessionStore();

const userImageURL = computed(() => {
    return session.user?.imageURL ? generateImageURL(session.user.imageURL) : undefined;
});


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
    width: 100vw;
    display: flex;
    max-height: 60px;
    min-height: 60px;
    position: sticky;
    align-items: center;
    position: -webkit-sticky;
    justify-content: space-between;
    border-bottom: solid 1px var(--navigation-border);
    background-color: var(--primary-background-color);

    #logo {
        flex: 1;
        font-weight: 900;
        font-size: 1.5rem;
        font-style: normal;
        text-align: center;
        color: var(--navigation-label);
        font-family: 'Archivo', 'Helvetica Nue';
    }

    #mobile-routes {
        display: none;
    }

    .routes {
        flex: 2;
        width: 100%;
        display: flex;
        min-width: 12rem;
        max-width: 25rem;
        align-items: center;
        justify-content: space-between;
    }

    .profile {
        flex: 1;
        align-items: center;
        justify-content: center;
    }
}

@media (max-width: 970px) {
    #navigation-bar {
        display: flex;
        justify-content: space-between;

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
            flex: 1;
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
    font-weight: 500;
    margin: 0rem 2rem;
    align-items: center;
    flex-direction: column;
    color: var(--navigation-label);

    .label {
        color: white;
        font-size: 0.65rem;
        text-transform: uppercase;
    }

    .home {
        width: 35px;
        height: 40px;
        background-size: 35px 40px;
        background-position: center;
        background-repeat: no-repeat;
        background-image: var(--home-icon);
    }

    .group {
        width: 40px;
        height: 40px;
        background-size: 40px;
        background-position: center;
        background-repeat: no-repeat;
        background-image: var(--group-icon);
    }

    .events {
        width: 40px;
        height: 40px;
        background-size: 33px;
        background-position: center;
        background-repeat: no-repeat;
        background-image: var(--events-icon);
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
    font-weight: 600;
    margin: 0rem 2rem;
    align-items: center;
    flex-direction: column;
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-thickness: 1.5px;
    
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
        background-image: var(--home-icon-selected);
    }

    .group {
        width: 40px;
        height: 40px;
        background-size: 40px;
        background-position: center;
        background-repeat: no-repeat;
        background-image: var(--group-icon-selected);
    }

    .events {
        width: 40px;
        height: 40px;
        background-size: 33px;
        background-position: center;
        background-repeat: no-repeat;
        background-image: var(--events-icon-selected);
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