import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import preprocess from "svelte-preprocess";

// https://vitejs.dev/config/
export default defineConfig({
    clearScreen: false,
    plugins: [svelte({
        extensions: [".md", ".svelte"],
        preprocess: [preprocess()],
    })],
})
