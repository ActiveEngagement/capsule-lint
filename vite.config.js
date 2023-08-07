import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// vite.config.js
export default defineConfig(config => ({
    resolve: {
        alias: {
            // 'html-minifier': 'https://cdnjs.cloudflare.com/ajax/libs/html-minifier/4.0.0/htmlminifier.js'
        }
    },
    build: {
        sourcemap: config.mode === 'production',
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'Capsulate',
            // the proper extensions will be added
            fileName: 'capsule-capsulate',
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ['vue'],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
    plugins: [vue()],
    define: {
        'process.env': process.env
    }
}));