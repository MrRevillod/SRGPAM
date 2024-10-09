/** @type {import('tailwindcss').Config} */

const flowbite = require("flowbite-react/tailwind")

module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
	darkMode: "class",
	theme: {
		extend: {
			borderWidth: {
				1: "1px",
			},
			colors: {
				primary: "#046c4e",
				"primary-dark": "#1c1c1c",
				"primary-light": "#f7fafc",
				"text-dark": "#2d3748",
				"text-light": "#f7fafc",
			},
		},
	},
	plugins: [flowbite.plugin()],
}
