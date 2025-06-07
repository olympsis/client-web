import {  defineNuxtModule } from 'nuxt/kit';

export default defineNuxtModule({
    setup(options, nuxt) {
        nuxt.hook('vite:extendConfig', async (viteConfig) => {
            if (typeof viteConfig?.build?.rollupOptions?.output === "object") {
                viteConfig.build.rollupOptions.output = { ...viteConfig.build.rollupOptions?.output, preserveModules: false }
            }
        });
    }
})