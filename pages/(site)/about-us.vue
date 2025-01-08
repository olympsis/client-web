<template>
	<NavigationBar/>
	<main id="main">
		<h2 class="header"> What is Olympsis? </h2>
		<div class="content-container">
			<p class="text">Olympsis is a dynamic social platform that serves as a thriving hub for athletes and sports enthusiasts alike. At its core, Olympsis is all about fostering a supportive community where individuals from diverse athletic backgrounds can unite to play sports and collaboratively strive towards their fitness and sporting goals. Whether you're a seasoned athlete or just starting your sporting journey, Olympsis provides a welcoming space where you can connect with like-minded individuals, share your expertise, and receive valuable guidance and encouragement.</p>
			<img class="image" src="@/assets/images/Basketball.webp"/>
		</div>
		<div class="container2">
			<img class="image2" src="@/assets/images/Tennis.webp"/>
			<p class="text2">Our goal is to create something truly exceptional, and we value the input of our amazing community. We believe that your feedback is invaluable in shaping the future of our product. If you’re an iOS user and want to be a part of this journey, we invite you to join us in the alpha testing phase. Your insights and suggestions will play a pivotal role in making our project the best it can be. Together, we can create something extraordinary! Join us on the iOS platform and help us shape the future.</p>
		</div>
	</main>
</template>

<script setup lang="ts">
import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
</script>

<style scoped>
@import '@/assets/css/main.css';
#main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  color: whitesmoke;
}

.header {
  margin: 3rem 0rem; 
  font-family: 'Roboto';
}

.content-container {
  width: 85%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.container2 {
  width: 85%;
  display: flex;
  margin: 5rem 0rem;
  flex-direction: row;
  justify-content: center;
}

.text {
  width: 50%;
  font-size: 1.5rem;
  text-align: left;
  margin-left: 3rem;
  font-weight: 500;
  font-family: 'roboto';
}
.image {
  height: 100%;
  width: 45%;
  margin-left: 4rem;
  margin-left: 3rem;
}

.text2 {
  width: 50%;
  font-size: 1.5rem;
  text-align: left;
  margin-left: 3rem;
  font-weight: 500;
  font-family: 'roboto';
}

.image2 {
  height: 100%;
  width: 45%;
  margin-left: 4rem;
  margin-left: 3rem;
}

@media screen and (max-width: 1100px) {

  .content-container {
    width: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .image {
    order: 1;
    margin: auto;
    width: 80%;
    content:url('@/assets/images/Basketball-Small.webp');
  }

  .text {
    order: 2;
    width: 80%;
    margin: 3rem auto;
    text-align: center;
  }

  .container2 {
    width: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .image2 {
    order: 1;
    margin: auto;
    width: 80%;
    content:url('@/assets/images/Tennis-Small.webp');
  }
  .text2 {
    order: 2;
    width: 80%;
    margin: 3rem auto;
    text-align: center;
  }
}
</style>