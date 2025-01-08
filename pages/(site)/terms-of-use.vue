<template>
    <TopBar/>
    <main id="main">
        <h1 class="header">Terms of Use</h1>
        
        <p class="section">
            Welcome to Olympsis! These Terms of Use govern your use of our Service, which includes our mobile apps, websites, and software (collectively, the \"Olympsis Service\" or \"Service\"). By accessing or using our Service, you agree to be bound by these Terms and our Privacy Policy.
        </p>

        <div class="section">
            <h3>
               1 -  Who can use the service?
            </h3>
            <p>
                You must be at least 13 years old to use the Olympsis Service. If you are under 18 years old, you represent that you have your parent or guardian's permission to use the Service.

            </p>
        </div>

        <div class="section">
            <h3>
                2 - Your Use of the Service
            </h3>
            <p>
                Olympsis grants you a limited, revocable, non-exclusive, non-transferable license to use the Service for your personal, non-commercial purposes only. You agree not to do any of the following:
                            
                            - Use the Service for any illegal or unauthorized purpose.
                            
                            - Violate any laws or third-party rights.
                            
                            - Sell, license, rent, modify, distribute, copy, reproduce, transmit, publicly display, publicly perform, publish, adapt, edit, create derivative works from, or exploit the Service.
                            
                            - Reverse engineer any aspect of the Service.
                            
                            - Your Content must not reflect nudity and should not be sexual in nature.
                            
                            - You will be accountable for any activity taking place under your account.
                            
                            - International users must abide by all applicable local laws regarding online behavior and acceptable content.
                            
                            - You are solely responsible for all data, images, links, and other content that you transmit, publish, and display on the platform.
                            
                            - You are not permitted to access Olympsis' private APIs in any way other than through the official Olympsis application.
            </p>
        </div>

        <div class="section">
            <h3>
                3 - Content on the Service
            </h3>
            <p>
                Our Service may contain information, text, links, graphics, photos, videos, or other materials ("Content"), including Content posted by you and others. You retain ownership of any intellectual property rights you hold in the Content you post. However, by posting Content, you grant Olympsis a worldwide, royalty-free, sublicense, and transferable license to host, store, use, display, reproduce, modify, adapt, edit, publish, and distribute that Content.
                You are solely responsible for the Content you post and its consequences. Your Content must comply with our Content Policy prohibiting nudity, sexually explicit or obscene material. Olympsis has the right (but not the obligation) to remove or edit any Content that violates these Terms at any time.
            </p>
        </div>

        <div class="section">
            <h3>
                4 - Third-Party Content and Services
            </h3>
            <p>
                The Service may provide access to third-party services, websites, information, advertisements, or other materials. Olympsis does not endorse or assume any responsibility for these third-party materials or services.
            </p>
        </div>

        <div class="section">
            <h3>
                5 - Modifications to the Service
            </h3>
            <p>
                Olympsis reserves the right to modify or discontinue the Service at any time without notice.
            </p>
        </div>

        <div class="section">
            <h3>
                6 - Copyright Infringement and DMCA Policy
            </h3>
            <p>
                We respond to copyright violation notices in accordance with the Digital Millennium Copyright Act. If you believe any Content infringes on your copyrights, please provide a written notice to our DMCA agent with the required information.
            </p>
        </div>

        <div class="section">
            <h3>
                7 - Disclaimers
            </h3>
            <p>
                YOUR USE OF THE SERVICE IS AT YOUR OWN RISK. THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE." OLYMPSIS MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
        </div>

        <div class="section">
            <h3>
                8 - Limitation of Liability
            </h3>
            <p>
                TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL OLYMPSIS BE LIABLE FOR ANY SPECIAL, INDIRECT, INCIDENTAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES ARISING FROM OR RELATED TO YOUR USE OF THE SERVICE.
            </p>
        </div>

        <div class="section">
            <h3>
                9 - Changes to Terms of Use
            </h3>
            <p>
                Olympsis may update these Terms of Use from time to time. Your continued use of the Service after any modifications constitutes your acceptance of the new Terms.
            </p>
        </div>

        <h4 class="section">
            If you have any questions or concerns about these Terms, please contact us at [contact@olympsis.com].
        </h4>
    </main>
</template>

<script setup lang="ts">
import TopBar from '~/components/site/TopBar/TopBar.vue';

useSeoMeta({
    title: 'Terms of Use | Olympsis',
    ogTitle: 'Terms of Use | Olympsis',
    description: 'The rules to follow on our platforms.',
    ogDescription: 'The rules to follow on our platforms.'
});
</script>

<style scoped>
@import '@/assets/css/main.css';
#main {
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: left;
  flex-grow: 1;
  margin: 2rem;
  color: var(--primary-label-color);
}

.header {
    margin-bottom: 2rem;
    font-family: 'Roboto';
}

.section {
    margin: 1rem 0rem;

    h3 {
        margin-bottom: 0.5rem;
    }

    p {
        margin: 0rem 1rem;
    }
}
</style>