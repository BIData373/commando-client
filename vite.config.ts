import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

const config = defineConfig({
	server: {
		port: 8080,
	},
	preview: {
		allowedHosts: ["np.vector.idf.cts", "pp.vector.idf.cts", "vector.idf.cts"],
	},
	plugins: [
		devtools({
			consolePiping: {
				levels: ["log", "warn", "error"],
			},
			enhancedLogs: { enabled: true },
		}),
		tsconfigPaths({ projects: ["./tsconfig.json"] }),
		tailwindcss(),
		tanstackRouter({ target: "react", autoCodeSplitting: true }),
		viteReact({
			babel: {
				plugins: [
					[
						"@emotion/babel-plugin",
						{
							autoLabel: "dev-only",
							labelFormat: "[local]",
						},
					],
				],
			},
		}),
	],
})

export default config
