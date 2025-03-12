import { defineNuxtPlugin } from '#app'

import type { Location } from '~/data/models/GenericModels';
import { useLocationDialogManager } from '~/composables/useLocationDialogManager';
import type { OlympsisLocationPermissions } from '~/types/location';

export interface DialogOptions {
    skipPermission?: boolean;
    clickOutsideToClose?: boolean;
}

declare module '#app' {
    interface NuxtApp {
        $locationDialog: (options?: DialogOptions) => Promise<{ location: Location, permission: OlympsisLocationPermissions }>;
    }
}

export default defineNuxtPlugin(_ => {
    if (import.meta.server) {
        return {
            provide: {
                locationDialog: () => Promise.reject(new Error('Cannot use locationDialog on server side'))
            }
        }
    }

    // Use our composable to manage dialog state
    const { openDialog } = useLocationDialogManager();

    // Provide the function to show the dialog
    return {
        provide: {
            locationDialog: openDialog
        }
    };
});