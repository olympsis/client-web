// CountrySelector.vue
<template>
  <div id="locale-selector">

	<div id="top-content">
		<button @click="$emit('close')">Cancel</button>
	</div>

    <!-- Country Selection -->
    <div class="selection-group">
      <label for="country">Select Country:</label>
      <select 
        id="country" 
        v-model="selectedCountry"
        @change="handleCountryChange"
        class="select-input"
      >
        <option value="">Choose a country</option>
        <option 
          v-for="country in countries" 
          :key="country.id" 
          :value="country"
        >
          {{ country.name }}
        </option>
      </select>
    </div>

    <!-- State Selection -->
    <div class="selection-group" v-if="selectedCountry">
      <label for="state">Select State:</label>
      <select 
        id="state" 
        v-model="selectedState"
        @change="handleStateChange"
        class="select-input"
      >
        <option value="">Choose a state</option>
        <option 
          v-for="state in states" 
          :key="state.id" 
          :value="state"
        >
          {{ state.name }}
        </option>
      </select>
    </div>

    <!-- Cities List -->
    <div class="selection-group" v-if="showCities && selectedState && cities.length">
      <label for="city">Select City:</label>
      <select 
        id="city" 
        v-model="selectedCity"
        @change="handleCityChange"
        class="select-input"
      >
        <option value="">Choose a city</option>
        <option 
          v-for="city in cities" 
          :key="city.id" 
          :value="city"
        >
          {{ city.name }}
        </option>
      </select>
    </div>

  </div>
</template>

<script setup lang="ts">
import { type Ref, ref } from 'vue';
import { LocaleService } from '@/data/services/LocaleService';
import { AdministrativeArea, Country, Location, SubAdministrativeArea } from '@/data/models/GenericModels';

const props = defineProps({
    showCities: { type: Boolean, default: false }
});

const emit = defineEmits([
    'country-changed',
    'state-changed',
    'close'
]);

const countries: Ref<Array<Country>> = ref([]);
const states: Ref<Array<AdministrativeArea>> = ref([]);
const cities: Ref<Array<SubAdministrativeArea>> = ref([]);

const selectedCountry: Ref<Country | null> = ref(null);
const selectedState: Ref<AdministrativeArea | null> = ref(null);
const selectedCity: Ref<SubAdministrativeArea | null> = ref(null);

const loading: Ref<any> = ref(false);
const error: Ref<any> = ref(null);

const service = new LocaleService();

fetchCountries();

async function fetchCountries() {
    try {
        loading.value = true
        const resp = await service.getCountries();
		if (resp) {
			countries.value = resp
		} else {
			loading.value = false	
		}
    } catch (error) {
        console.error('Error fetching countries:', error)
    } finally {
        loading.value = false
    }
}

async function fetchStates() {
	try {
		const id = selectedCountry.value?.id ?? '';
		const resp = await service.getAdministrativeAreas(id);
		if (resp) {
			states.value = resp;
		}
	} catch (error) {
		console.error('Error fetching administrative areas:', error)
	} finally {

	}
}

async function fetchCities() {
    try {
		const id = selectedState.value?.id ?? '';
		const resp = await service.getSubAdministrativeAreas(id);
		if (resp) {
			cities.value = resp;
		}
	} catch (error) {
		console.error('Error fetching administrative areas:', error)
	} finally {

	}
}

// Handle country selection
async function handleCountryChange() {
    if (selectedCountry.value) {
        selectedState.value = null
        cities.value = []
        await fetchStates()
    } else {
        states.value = []
        cities.value = []
    }
    emit('country-changed', selectedCountry.value)
}

// Handle state selection
async function handleStateChange() {
    if (selectedState.value) {
        cities.value = []
        if (props.showCities) {
            await fetchCities()
        }
    }
    emit('state-changed', selectedState.value)
}

// Handle city selection
function handleCityChange() {
    emit('close', {
		country: selectedCountry.value?.name,
		state: selectedState.value?.code,
		city: selectedCity.value?.name
	});
}
</script>

<style scoped>
#locale-selector {
	max-width: 600px;
	padding: 1rem 2rem;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
	background-color: var(--secondary-background-color);
	
	#top-content {
		display: flex;
		justify-content: flex-end;

		button {
			all: unset;
			margin: 1rem;
      cursor: pointer;
			color: var(--primary-label-color);
		}
	}
}

.selection-group {
  	margin-bottom: 20px;

	label {
		display: block;
		margin-bottom: 5px;
		font-weight: bold;
		color: var(--primary-label-color);
	}
}

.select-input {
	width: 100%;
	padding: 8px;
	border: 1px solid #ccc;
	border-radius: 4px;
	font-size: 16px;
}

.cities-list {
  	margin-top: 20px;
}

.cities-list ul {
	list-style: none;
	padding: 0;
}

.cities-list li {
	padding: 8px;
	border-bottom: 1px solid #eee;
}

.cities-list li:last-child {
  	border-bottom: none;
}
</style>