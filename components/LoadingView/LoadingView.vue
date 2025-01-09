<template>
    <div id="loading">
        <img src="@/assets/images/logo.simple.white.png">
        <h1>Olympsis</h1>
    </div>
</template>

<style scoped>
#loading {
    width: 100vw;
    height: 100dvh;
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