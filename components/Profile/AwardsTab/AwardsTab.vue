<template>
    <div id="awards-tab">
        <div id="badges-section" class="section">
            <h2>Badges</h2>
            <div class="list">
                No Recorded Trophies
            </div>
        </div>
        <div id="trophies-section" class="section">
            <h2>Trophies</h2>

            <div class="list">
                No Recorded Trophies
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
#awards-tab {
    width: 100%;
    display: flex;
    flex-direction: column;

    .section {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .list {
        display: flex;
        min-height: 10rem;
        align-items: center;
        justify-content: center;
    }
}
</style>