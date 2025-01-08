<template>
    <div class="container">
        <h1 class="title"> Join a new community of athletes </h1>
        <h2 class="sub-title"> 
            Welcome to Olympsis—the platform to organize sports together. Join existing sports groups or create your own, find nearby locations, and get moving. Sign in or download on the App Store for free.
        </h2>
        <button class="action-button" @click="goToNewsletter"> <img src="@assets/Download-AppStore.svg"/> </button>
    </div>
</template>

<script setup lang="ts">
function goToNewsletter() {
    window.location.href = "https://apps.apple.com/us/app/olympsis/id6503405536"
}
</script>

<style scoped>
@import '@assets/main.css';
.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 30rem;
    max-height: 45rem;
    padding: 1rem 2rem;
    border-radius: 10px;
    background-color: #2C2C2E;
}

.title {
    font-family: 'Roboto';
    font-style: normal;
    color: white;
    text-align: center;
    margin-top: 2rem;
}

.sub-title {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 300;
    font-size: 1.2rem;
    color: white;
    text-align: center;
    margin: 0.2rem 0rem;
    margin-bottom: 2rem;
}

.body {
    font-family: 'Roboto';
    text-align: center;
    font-weight: 500;
    margin: 0rem 3rem;
    font-size: 1.2rem;
    letter-spacing: .02rem;
}

.test-link {
    color: #4758D6 !important;
    margin: 0rem 0.3rem;
}

.text-container {
    margin: 1rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    font-family: 'Roboto';
    font-weight: 500;
    font-size: 1.4rem;
    letter-spacing: .02rem;
    margin-bottom: 1rem;
}

.text-input {
    width: 50%;
    margin-top: 5rem;
    margin-bottom: 1rem;
    margin-left: 5rem;
    margin-right: 5rem;
    border-radius: 5px;
    border: 0px;
    height: 2rem;
    font-size: 1rem;
    padding: 0.2rem 0.3rem;
}

.action-button {
    all: unset;
    cursor: grab;
    color: white;
    margin: 2rem 0rem;
}

@media screen and (max-width: 1100px) {

    .container { 
        max-width: 20rem;
    }

    .title {
        font-size: 1.5rem;
    }

    .sub-title {
        font-size: 0.9rem;
    }

    .text-container {
        font-size: 0.7rem;
        margin-top: 0rem;
    }

    .body {
        font-size: 0.7rem;
        margin: 0rem 1rem;
    }

    .text-input {
        width: 70%;
        height: 1rem;
        margin-top: 2rem;
        font-size: 0.5rem;
    }

    .action-button {
        height: 1.5rem;
        font-size: 0.7rem;
    }
}
</style>