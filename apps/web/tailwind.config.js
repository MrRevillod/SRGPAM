/** @type {import('tailwindcss').Config} */

const flowbite = require("flowbite-react/tailwind")

module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
	theme: {
		extend: {
			borderWidth: {
				1: "1px",
			},
		},
	},
	plugins: [flowbite.plugin()],
}
