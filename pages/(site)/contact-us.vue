<template>
	<TopBar/>
	<main id="main">
		<h2 class="header"> Reach out to us </h2>
		<div class="container">
			<p class="text">We value your feedback and are here to assist you in any way we can. Whether you have questions, suggestions, or need support, don’t hesitate to reach out to us. We are dedicated to ensuring your experience with us is seamless and enjoyable. Feel free to contact us via our social media accounts. Your input is invaluable in helping us improve our services, so please don’t hesitate to get in touch. We look forward to hearing from you!</p>
		</div>
		<div class="social-container">
			<a href= "mailto: contact@olympsis.com"><img src="@/assets/images/mail.png"/></a>
			<a href="https://www.instagram.com/olympsis/"><img src="@/assets/images/instagram.png"/></a>
			<a href="https://twitter.com/olympsis"><img src="@/assets/images/twitter.png"/></a>
		</div>
	</main>
  <BottomBar/>
</template>
  
<script setup lang="ts">
import TopBar from '~/components/site/TopBar/TopBar.vue';
import BottomBar from '~/components/site/BottomBar/BottomBar.vue';

useSeoMeta({
    title: 'Contact Us | Olympsis',
    ogTitle: 'Contact Us | Olympsis',
    description: 'We would love to hear from you! Reach out to us on any of our social media platforms.',
    ogDescription: 'We would love to hear from you! Reach out to us on any of our social media accounts.'
});
</script>

<style scoped>
  @import '@/assets/css/main.css';
  #main {
    display: flex;
    height: 100vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    color: var(--primary-label-color);
  }
  
  img {
    width: 2rem;
    height: 2rem;
    margin: 0rem 1rem;
  }
  
  .header {
    margin: 3rem 0rem; 
    font-family: 'Roboto';
  }
  
  .container {
    width: 60%;
  }
  
  .text {
    font-family: 'roboto';
    font-size: 1.5rem;
    text-align: center;
  }
  
  .social-container {
    display: flex;
    flex-grow: 1;
    margin: 3rem 0rem; 
  }
  
  @media screen and (max-width: 1000px) {
  
    .header {
      margin: 2rem 0rem;
    }
  
    .text {
      font-size: 1rem;
    }
  }
  
  </style>