<template>
    <div class="container">
        <img src="@assets/logo.simple.white.png">
        <h1>Olympsis</h1>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    color: white;
    font-weight: 900;
    font-style: italic;
    padding: 0rem 1rem;
    font-family: 'Roboto', sans-serif;

    background-size: contain;
    background-position: center;
    background-color: var(--primary-brand-color);

    img {
        width: 4rem;
        height: 4rem;
        margin: 1rem 0rem;
    }
}
</style>