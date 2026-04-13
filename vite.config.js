import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        home: fileURLToPath(new URL('./src/pages/home.html', import.meta.url)),
        login: fileURLToPath(new URL('./src/pages/login.html', import.meta.url)),
        signup: fileURLToPath(new URL('./src/pages/signup.html', import.meta.url)),
      },
    },
  },
});
