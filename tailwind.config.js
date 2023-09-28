/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './demo/**/*.vue'
  ],
  theme: {
    extend: {},
  },
  presets: [
    require('@vue-interface/form-control/tailwindcss')
  ],
  safelist: [
    'textarea-field'
  ]
}

