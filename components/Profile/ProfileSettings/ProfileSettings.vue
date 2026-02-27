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
                Settings
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
                <img class="icon" src="@/assets/icons/door-open/door.open.fill.white.svg">
                Log Out
            </button>
            <button class="destructive" @click="$emit('delete')">
                <img class="icon" src="@/assets/icons/trash/trash.white.svg">
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
    /* Glassmorphism — translucent bg with backdrop blur */
    background: rgba(243, 242, 239, 0.40);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: var(--component-border) solid 1px;
    border-radius: 20px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

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
            padding: 1rem;
            display: flex;
            cursor: pointer;
            font-size: 0.9rem;
            margin: 0.3rem 0rem;
            align-items: center;
            color: var(--primary-label-color);
            border-radius: var(--button-border-radius);

            /* Glass button */
            background: rgba(243, 242, 239, 0.40);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: var(--component-border) solid 1px;
            box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        }

        a {
            padding: 1rem;
            display: flex;
            cursor: pointer;
            font-size: 0.9rem;
            margin: 0.3rem 0rem;
            align-items: center;
            color: var(--primary-label-color);
            border-radius: var(--button-border-radius);

            /* Glass button */
            background: rgba(243, 242, 239, 0.40);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: var(--component-border) solid 1px;
            box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
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

            /* Red-tinted glass for destructive actions */
            background: rgba(195, 43, 66, 0.65);
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

/* Dark-mode glass tint */
@media (prefers-color-scheme: dark) {
    #profile-settings {
        background: rgba(0, 0, 0, 0.60);

        #actions button,
        #actions a {
            background: rgba(0, 0, 0, 0.60);
        }

        #actions .destructive {
            background: rgba(195, 43, 66, 0.65);
        }
    }
}
</style>