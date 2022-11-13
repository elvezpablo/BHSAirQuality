import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const {CF_PAGES} = process.env;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: (CF_PAGES ? "/" : "/BHSAirQuality/")
})
