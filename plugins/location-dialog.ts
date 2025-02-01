// plugins/location-dialog.js
import { createVNode, render, type App } from 'vue'
import LocationRequest from '~/components/Modals/System/LocationRequest/LocationRequest.vue'

interface LocationCoords {
    latitude: number
    longitude: number
}
  
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $locationDialog: {
            show: () => Promise<LocationCoords>
        }
    }
}
  
export default defineNuxtPlugin((nuxtApp) => {
    const locationDialog = {
        show(): Promise<LocationCoords> {
        return new Promise((resolve, reject) => {
            const container = document.createElement('dialog')
            
            const vnode = createVNode(LocationRequest, {
            onGranted: (location: LocationCoords) => {
                render(null, container)
                document.body.removeChild(container)
                resolve(location)
            },
            onDenied: () => {
                render(null, container)
                document.body.removeChild(container)
                reject(new Error('Location access denied'))
            },
            onError: (error: GeolocationPositionError) => {
                render(null, container)
                document.body.removeChild(container)
                reject(error)
            }
            })
            
            render(vnode, container)
            document.body.appendChild(container)
        })
        }
    }

    nuxtApp.provide('locationDialog', locationDialog)
})