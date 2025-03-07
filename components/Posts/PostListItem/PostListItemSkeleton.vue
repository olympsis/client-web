<template>
    <li id="post-list-item-skeleton">
        <!-- Header -->
        <div class="header">
            <div class="user-info">
                <div class="profile skeleton"/>
                <div class="name skeleton"/>
            </div>
            <div class="ellipsis skeleton"/>
        </div>

        <!-- Body -->
        <div class="body">
            <div v-if="hasImage" class="image skeleton"/>
            <div class="paragraph">
                <div class="text skeleton"/>
                <div class="text skeleton"/>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="timestamp skeleton"/>

            <div class="actions">
                <div class="option skeleton"/>
                <div class="option skeleton"/>
                <div class="option skeleton"/>
            </div>
        </div>
    </li>
</template>

<script setup lang="ts">
const props = defineProps({
    hasImage: Boolean
});
</script>

<style scoped>
#post-list-item-skeleton {
    width: 100%;
    margin: 0 auto;
    max-width: 42rem;
    border-radius: 10px;
    background-color: var(--secondary-background-color);

    .header {
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .user-info {
            display: flex;
            flex-direction: row;
            align-items: center;

            .profile {
                height: 2rem;
                width: 2rem;
                border-radius: 50px;
            }

            .name {
                height: 1rem;
                width: 7rem;
                border-radius: 5px;
                margin: 0rem 0.7rem;
            }
        }

        .ellipsis {
            width: 2rem;
            height: 0.5rem;
            border-radius: 5px;
        }
    }

    .body {
        .image {
            width: 40rem;
            object-fit: cover;
        }

        .image {
            width: 100%;
            height: 30rem;
            max-width: 40rem;
            margin-bottom: 1rem;
        }

        .paragraph {
            .text {
                width: auto;
                height: 0.8rem;
                border-radius: 5px;
                margin: 0.5rem 1rem;
            }
        }
    }

    .footer {
        display: flex;
        padding: 1rem;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .timestamp {
            width: 6rem;
            height: 1rem;
            border-radius: 5px;
        }

        .actions {
            display: flex;

            .option {
                width: 2rem;
                height: 2rem;
                margin: 0rem 0.5rem;
                border-radius: 5px;
            }
        }
    }

    @media (max-width: 675px) {
        border-radius: unset;
    }
}
</style>