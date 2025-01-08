<template>
    <NavigationBar />
    <main id="main">
        <h1 class="header">Privacy Policy</h1>
        
        <p class="section">
            At Olympsis, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect the information you provide to us.
        </p>

        <div class="section">
            <h3>
                Information We Collect
                We may collect various types of information from you, including:
            </h3>
            <p>
                1. Personal Information: We collect basic personal information such as your name, email address, and other contact details when you create an account or interact with our services.
            </p>
            <p>
                2. Usage Data: We collect data about how you interact with our platform, including the features you use, the content you access, and your preferences.
            </p>
            <p>
                3. Location Data: With your permission, we may collect your location data to provide you with location-aware content, such as local events and activities.
            </p>
        </div>

        <div class="section">
            <h3>
                How We Use Your Information
                We use the information we collect for the following purposes:
            </h3>
            <p>
                1. To provide and improve our services: We use your information to operate, maintain, and enhance the features and functionality of our platform.
            </p>
            <p>
                2. Personalization: We may use your usage data and preferences to provide you with personalized recommendations and tailored content.
            </p>
            <p>
                3. Location-based Services: With your consent, we may use your location data to show you relevant local events, activities, and other location-aware content.
            </p>
            <p>
                4. Internal Analysis: We may analyze the collective data we collect to understand usage patterns, improve our services, and develop new features.
            </p>
        </div>

        <div class="section">
            <h3>
                Data Retention and Anonymization
            </h3>
            <p>
                We take steps to ensure that the data we collect is not directly linked to your individual identity. If you choose to delete your account, the data associated with your account will be anonymized and disassociated from your personal information. This anonymized data may be retained and used for internal purposes, such as improving our services and providing better recommendations to other users.
            </p>
        </div>

        <div class="section">
            <h3>
                Data Sharing and Disclosure
            </h3>
            <p>
                We do not sell, trade, or rent your personal information to third parties. However, we may share anonymized and aggregated data with trusted partners for analytical purposes or to improve our services.
            </p>
        </div>

        <div class="section">
            <h3>
                Your Rights and Choices
            </h3>
            <p>
                You have the right to access, modify, or delete the personal information we have collected about you. You can also choose to opt-out of certain data collection practices, such as location tracking, by adjusting your account settings.
            </p>
        </div>

        <div class="section">
            <h3>
                Security
            </h3>
            <p>
                We implement reasonable technical and organizational measures to protect your information from unauthorized access, disclosure, alteration, or destruction.
            </p>
        </div>

        <div class="section">
            <h3>
                Changes to this Policy
            </h3>
            <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes and provide you with the opportunity to review the updated policy
            </p>
        </div>

        <h4 class="section">
            If you have any questions or concerns about our Privacy Policy, please contact us at [contact@olympsis.com].
        </h4>
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