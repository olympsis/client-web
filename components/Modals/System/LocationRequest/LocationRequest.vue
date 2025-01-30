<template>
    <div id="location-request" class="modal">
        <div class="header">
            <h1 class="title">Allow Olympsis to use your location</h1>
            <h2 class="sub-title">We use your location to show you sports events and venues within your selected search radius.</h2>
        </div>

        <div class="body">
            <picture>
                <source srcset="@/assets/icons/share-location/share-location.white.svg" media="(prefers-color-scheme: dark)">
                <img src="@/assets/icons/share-location/share-location.svg">
            </picture>
        </div>

        <div class="actions">
            <button class="secondary button" @click="$emit('deny')">
                Deny
            </button>

            <button class="primary button" @click="$emit('allow')">
                Allow
            </button>
        </div>
    </div>
</template>

<style scoped>
#location-request {
    max-width: 32rem;

    .header {
        flex-direction: column;

        .sub-title {
            font-size: 1rem;
            font-style: normal;
            font-weight: normal;
            margin: 0.5rem 2rem;
            color: var(--primary-label-color);
        }
    }

    .body {
        picture {
            img {
                height: auto;
                width: 10rem;
            }
            margin: 5rem auto;
        }
    }

    .actions {
        .secondary {
            margin-right: 0.5rem;
        }

        .primary {
            margin-left: 0.5rem;
        }
    }
}
</style>