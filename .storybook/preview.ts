import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import { setup } from "@storybook/vue3"
import type { Preview } from "@storybook/vue3";

import '../src/assets/main.css';
import 'primevue/resources/themes/aura-light-green/theme.css'

const pinia = createPinia();

setup((app) => {
  app.use(PrimeVue, {ripple:true});
  app.use(pinia);
})

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
