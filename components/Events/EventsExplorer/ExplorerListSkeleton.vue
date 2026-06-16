<!--
    ExplorerListSkeleton.vue

    Template/skeleton placeholder for the events & venues lists in EventsExplorer.
    Used for BOTH modes — event and venue cards share the same shape (a ~28rem
    image with a detail bar overlaid at the bottom), so one card skeleton covers
    both. The root <ul> carries the `list-grid` class so it inherits the
    explorer's grid columns (1 col, 2 cols ≥1300px) and stays visually aligned
    with the real list it replaces.
-->
<template>
    <ul class="list-grid">
        <li v-for="n in count" :key="n" class="card-skeleton">
            <div class="image skeleton"/>
            <div class="details">
                <div class="line title skeleton"/>
                <div class="line meta skeleton"/>
            </div>
        </li>
    </ul>
</template>

<script setup lang="ts">
defineProps({
    // How many placeholder cards to render. Default fills a typical viewport.
    count: { type: Number, default: 4 },
});
</script>

<style scoped>
.card-skeleton {
    position: relative;
    width: 100%;
    height: 28rem;            /* match the real EventListItem/VenueListItem height */
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--component-border-color);
    list-style: none;
}

/* Full-bleed image placeholder (the .skeleton class drives the shimmer). */
.image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}

/* Detail bar overlaid at the bottom — mirrors the real card's glass detail row. */
.details {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0.75rem 1rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background-color: var(--primary-background-color);
    border-top: 1px solid var(--component-border-color);
}

.line {
    height: 0.9rem;
    border-radius: 6px;
}

.title { width: 60%; height: 1.2rem; }
.meta { width: 40%; }
</style>
