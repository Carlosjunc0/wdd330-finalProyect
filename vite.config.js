import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        invitation: resolve(__dirname, 'invitation.html'),
        rsvp: resolve(__dirname, 'rsvp.html'),
        template: resolve(__dirname, 'template.html'),
        error: resolve(__dirname, '404.html')
      }
    }
  }
});