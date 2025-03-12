<!-- components/LocationDialog.vue -->
<template>
	<Teleport to="body">
    	<transition name="fade">
    		<div v-if="isDialogVisible" class="location-dialog-overlay" @click.self="closeIfClickOutside">
          		<div class="location-dialog">
					<div class="location-dialog-header">
						<div class="title">{{ title }}</div>
						<div class="sub-title">{{ subTitle }}</div>
					</div>
				
					<div class="location-dialog-content">
						<!-- Permission request step -->
						<div v-if="currentStep === 'permission'" class="permission-step">
							<div class="icon-container">
								<picture>
									<source srcset="@/assets/icons/share-location/share-location.white.svg" media="(prefers-color-scheme: dark)">
									<img class="icon" src="@/assets/icons/share-location/share-location.svg">
								</picture>
							</div>
							
							<div class="buttons-container">
								<button class="button secondary" @click="switchToManualInput">Deny Access</button>
								<button class="button primary" @click="requestGeolocation">Allow Access</button>
							</div>
						</div>
						
						<!-- Manual location selection step -->
						<div v-if="currentStep === 'manual'" class="manual-step">
							<LocalePicker :show-cancel="false" :show-cities="true" @completed="handleLocaleCompleted"/>
							
							<div class="buttons-container">
								<button class="button secondary" @click="closeDialog">
									Cancel
								</button>
								<button class="button primary" @click="submitManualLocation" :disabled="!manualLocation">
									Confirm Location
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
    	</transition>
	</Teleport>
</template>
  
<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { Location } from '~/data/models/GenericModels';
import { useLocationDialogManager } from '~/composables/useLocationDialogManager'

import LocalePicker from '~/components/LocalePicker/LocalePicker.vue';
  
// Get state and methods from our composable
const { 
	isDialogVisible, 
	currentStep, 
	currentDialogOptions,
	closeDialog, 
	selectLocation,
	switchToManualInput
} = useLocationDialogManager();

const title = computed<string>(() => {
	return currentStep.value === 'permission' ? "Allow Olympsis to use your location" : "Setting a fallback Location";
});

const subTitle = computed<string>(() => {
	return currentStep.value === 'permission' ? "We use your location to provide relevant sports events and venues in your area." : "If we can’t access your location, a predefined fallback will ensure you still receive relevant results."	
});
// Local state
const manualLocation = ref<Location | undefined>(undefined);

// Geolocation status and errors
const geolocationError = reactive({
	code: 0,
	message: ''
});


// Methods
const closeIfClickOutside = () => {
	if (currentDialogOptions.value.clickOutsideToClose !== false) {
		closeDialog();
	}
};

// Geolocation methods
const requestGeolocation = () => {
	if (!navigator.geolocation) {
		geolocationError.code = 0;
		geolocationError.message = 'Geolocation is not supported by this browser.';
		switchToManualInput();
		return;
	}

	navigator.geolocation.getCurrentPosition(
		handleGeolocationSuccess,
		handleGeolocationError,
		{
		enableHighAccuracy: true,
		timeout: 10000,
		maximumAge: 0
		}
	);
};

function handleLocaleCompleted(event: any) {
    if (event) {
		manualLocation.value = new Location(
			event.coordinates[1], 
			event.coordinates[0],
			event.city,
			event.state,
			undefined,
			undefined,
			event.country,
			undefined
		)
	}
}

function handleGeolocationSuccess (position: GeolocationPosition) {
	const locationData: Location = new Location(
		position.coords.latitude, 
		position.coords.longitude
	);
	selectLocation({ location: locationData, permission: 'prompt' });
};

const handleGeolocationError = (error: GeolocationPositionError) => {
	geolocationError.code = error.code;
	geolocationError.message = error.message;

	// If geolocation failed, show manual input
	switchToManualInput();
};

const submitManualLocation = () => {
    if (!manualLocation.value) return;
    selectLocation({ location: manualLocation.value, permission: 'manual' });
};
</script>
  
<style scoped>
.location-dialog-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999; /* Higher z-index to ensure it's on top */
	/* Make sure it covers the entire viewport */
	height: 100vh;
	width: 100vw;
}

.location-dialog {
	width: 90%;
	height: 100%;
	max-width: 400px;
	max-height: 490px;
	overflow-y: auto;
	border-radius: 20px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	background-color: var(--primary-background-color);
}

.location-dialog-header {
	display: flex;
	padding-top: 2rem;
	margin: 0rem 1rem;
	align-items: center;
	flex-direction: column;
	justify-content: space-between;
}

.location-dialog-header h2 {
	margin: 0;
	font-size: 1.25rem;
	font-weight: 600;
}

.location-dialog-content {
	padding: 20px;
}

.icon-container {
	margin-top: 3rem;
	text-align: center;
	margin-bottom: 6rem;

	.icon {
		width: 7rem;
		height: 7rem;
	}
}

.permission-description {
	color: #666;
	font-size: 0.9rem;
	margin-bottom: 24px;
}

.buttons-container {
	display: flex;
	gap: 12px;
	margin-top: 24px;
	justify-content: space-between;
}

.button {
	width: 100%;
	border: none;
	cursor: pointer;
	font-weight: 600;
	font-size: 0.9rem;
	border-radius: 4px;
	text-align: center;
	border-radius: 10px;
}

.button.primary {
	color: white;
	background-color: var(--primary-brand-color);
}

.button.primary:disabled {
	background-color: #a0c3ef;
	cursor: not-allowed;
}

.button.secondary {
	background-color: #f0f0f0;
	color: #333;
}

.button.secondary:hover {
	background-color: #e0e0e0;
}

.location-inputs {
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-top: 16px;
}

.input-group {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.input-group label {
	font-size: 14px;
	font-weight: 500;
	color: #555;
}

.input-group select {
	padding: 10px 12px;
	border: 1px solid #ddd;
	border-radius: 4px;
	font-size: 14px;
	background-color: white;
}

.input-group select:disabled {
	background-color: #f5f5f5;
	color: #999;
	cursor: not-allowed;
}

/* Transition animations */
.fade-enter-active, .fade-leave-active {
	transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
	opacity: 0;
}

.title {
    font-weight: bold;
    font-size: 1.2rem;
}

.sub-title {
    margin: 0.5rem 0rem;
    text-align: center;
}

#locale-picker {
	background-color: unset;
}
</style>