<template>
    <div id="profile-settings" class="modal">
        <div id="header" class="header">
            <button class="secondary button centered" @click="$emit('close')">
                <picture>
                    <source srcset="@/assets/icons/xmark/xmark.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/xmark/xmark.svg">
                </picture>
            </button>

            <div class="title">
                Events Settings
            </div>
        </div>

        <div id="actions">
            <button class="item" @click="$emit('report')">
                <picture class="icon">
                    <source srcset="@/assets/icons/bug/bug.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/bug/bug.svg">
                </picture>
                Report an Issue
            </button>
            <RouterLink to="/terms-of-use" class="item">
                <picture class="icon">
                    <source srcset="@/assets/icons/description/description.fill.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/description/description.fill.svg">
                </picture>
                Terms of Service
            </RouterLink>
            <RouterLink to="/privacy-policy" class="item">
                <picture class="icon">
                    <source srcset="@/assets/icons/description/description.fill.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/description/description.fill.svg">
                </picture>
                Privacy Policy
            </RouterLink>
            <button class="destructive" @click="$emit('logout')">
                <picture class="icon">
                    <source srcset="@/assets/icons/door-open/door.open.fill.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/door-open/door.open.fill.svg">
                </picture>
                Log Out
            </button>
            <button class="destructive" @click="$emit('delete')">
                <picture class="icon">
                    <source srcset="@/assets/icons/trash/trash.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/trash/trash.svg">
                </picture>
                Delete Account
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineEmits([
    'close',
    'report',
    'logout',
    'delete'
]);
</script>

<style scoped>
#profile-settings {
    #header {
        button {
            margin-left: 1rem;
        }

        .title {
            margin: 0rem 1rem;
        }
    }

    #actions {
        width: 100%;
        display: flex;
        max-width: 25rem;
        padding: 0rem 2rem;
        margin-bottom: 2rem;
        flex-direction: column;

        button {
            border: unset;
            padding: 1rem;
            display: flex;
            cursor: pointer;
            font-size: 0.9rem;
            margin: 0.3rem 0rem;
            align-items: center;
            color: var(--primary-label-color);
            border-radius: var(--button-border-radius);
            background-color: var(--tertiary-background-color);
        }

        a {
            border: unset;
            padding: 1rem;
            display: flex;
            cursor: pointer;
            font-size: 0.9rem;
            margin: 0.3rem 0rem;
            align-items: center;
            color: var(--primary-label-color);
            border-radius: var(--button-border-radius);
            background-color: var(--tertiary-background-color);
        }

        .icon {
            /* width: 24px; */
            height: 24px;
            display: flex;
            align-items: center;
            margin-right: 0.5rem;
        }

        .destructive {
            display: flex;
            color: white;
            align-items: center;
            background-color: #8c1d1d;
        }
    }

    .icon {
        /* width: 24px; */
        height: 24px;
        display: flex;
        align-items: center;
        margin-right: 0.5rem;
    }
}
</style>