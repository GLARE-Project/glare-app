module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      dropShadow: {
        "3xl": "0 5px 20px rgb(0 0 0 / 95%)",
      },
    },
  },
  plugins: [require("tw-elements/dist/plugin")],
};
