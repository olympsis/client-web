<template>
    <div id="club-list-card-template">
        <!-- Picture & Header -->
        <div id="club-header">
            <div id="image" class="skeleton-loader"/>

            <div id="club-info">
                <div id="name" class="skeleton-loader"/>
                <div id="location" class="skeleton-loader"/>
            </div>
        </div>

        <!-- Tags -->
        <div id="club-tags">
            <div class="skeleton-loader"/>
            <div class="skeleton-loader"/>
            <div class="skeleton-loader"/>
        </div>


        <!-- Body -->
        <div id="club-body">
            <div class="skeleton-loader"/>
            <div class="skeleton-loader"/>
            <div class="skeleton-loader"/>
        </div>

        <!-- Actions -->
        <div id="club-actions" >
            <div id="button-left" class="skeleton-loader"/>
            <div id="button-right" class="skeleton-loader"/>
        </div>
     </div>
</template>

<style scoped>
@keyframes shimmer {
    0% {
        background-position: -1000px 0;
    }
    100% {
        background-position: 1000px 0;
    }
}

.skeleton-loader {
    background: linear-gradient(
        90deg,
        var(--tertiary-background-color) 0%,
        rgba(255, 255, 255, 0.1) 50%,
        var(--primary-brand-color) 300%
    );
    background-size: 1000px 100%;
    animation: shimmer 5s infinite linear;
}

#club-list-card-template {
    padding: 1rem;
    max-width: 30rem;
    border-radius: var(--card-border-radius);
    background-color: var(--secondary-background-color);

    #club-header {
        display: flex;

        #image {
            height: 6rem;
            min-width: 6rem;
            border-radius: 10px;
            background-color: var(--tertiary-background-color);
        }

        #club-info {
            width: 100%;
            margin: 0rem 1rem;
            #name {
                height: 1.3rem;
                border-radius: 10px;
                background-color: var(--tertiary-background-color);
            }
            #location {
                height: 1.1rem;
                margin: 1rem 0rem;
                border-radius: 10px;
                background-color: var(--tertiary-background-color);
            }
        }
    }

    #club-tags {
        display: flex;

        div {
            width: 6rem;
            height: 1.5rem;
            margin: 1rem 0.5rem;
            border-radius: 10px;
            background-color: var(--tertiary-background-color);
        }
    }

    #club-body {
        display: flex;
        flex-direction: column;

        div {
            width: 100%;
            height: 0.5rem;
            border-radius: 10px;
            margin: 0.25rem 0rem;
            background-color: var(--tertiary-background-color);
        }
    }

    #club-actions {
        display: flex;
        div {
            width: 100%;
            height: 2rem;
            margin-top: 1rem;
            border-radius: 10px;
            background-color: var(--tertiary-background-color);
        }

        #button-left {
            margin-right: 0.5rem;
        }

        #button-right {
            margin-left: 0.5rem;
        }
    }
}
</style>