import { ref, readonly } from 'vue'
import type { DialogOptions } from '~/plugins/location-dialog'
import { Location } from '~/data/models/GenericModels';
import type { OlympsisLocationPermissions } from '~/types/location';

// Create a single instance of state that will be shared across all imports
const isDialogVisible = ref(false);
const currentDialogOptions = ref<DialogOptions>({});
const currentStep = ref<'permission' | 'manual'>('permission');

// For promise resolution
let resolvePromise: ((data: { location: Location, permission: OlympsisLocationPermissions }) => void) | null = null;
let rejectPromise: ((reason: Error) => void) | null = null;

// Export a composable function
export function useLocationDialogManager() {
    // Function to open the dialog
    const openDialog = (options: DialogOptions = {}): Promise<{ location: Location, permission: OlympsisLocationPermissions }> => {
        return new Promise((resolve, reject) => {
            // Store promise handlers
            resolvePromise = resolve;
            rejectPromise = reject;
            
            // Set dialog options
            currentDialogOptions.value = options;
            currentStep.value = options.skipPermission ? 'manual' : 'permission';
            
            // Show the dialog
            isDialogVisible.value = true;
        });
    };
  
    // Function to close the dialog
    const closeDialog = () => {
        isDialogVisible.value = false;

        // If there's a pending promise that hasn't been resolved yet, reject it
        if (rejectPromise) {
            rejectPromise(new Error('Dialog closed without selection'));
            resolvePromise = null;
            rejectPromise = null;
        }
    };
  
    // Function to handle location selection
    const selectLocation = (data: { location: Location, permission: OlympsisLocationPermissions }) => {
        isDialogVisible.value = false;

        // Resolve the promise with location data
        if (resolvePromise) {
            resolvePromise(data);
            resolvePromise = null;
            rejectPromise = null;
        }
    };
  
    // Function to switch to manual input
    const switchToManualInput = () => {
            currentStep.value = 'manual';
    };
  
    return {
        // Expose state as readonly to prevent external modification
        isDialogVisible: readonly(isDialogVisible),
        currentDialogOptions: readonly(currentDialogOptions),
        currentStep: readonly(currentStep),

        // Expose methods
        openDialog,
        closeDialog,
        selectLocation,
        switchToManualInput
    };
}