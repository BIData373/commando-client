import postcssCascadeLayers from "@csstools/postcss-cascade-layers"
import postcssIsPseudoClass from "@csstools/postcss-is-pseudo-class"
import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import legacy from "@vitejs/plugin-legacy"
import viteReact from "@vitejs/plugin-react"
import postcss from "postcss"
import type { Plugin } from "vite"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

// Lightning CSS encodes versions as major << 16
const CHROME_83 = 83 << 16

// Tailwind emits its CSS after Vite's PostCSS step, so legacy lowering must run on the final bundle
function legacyCssPlugin(): Plugin {
	const processor = postcss([postcssCascadeLayers(), postcssIsPseudoClass()])

	return {
		name: "legacy-css",
		apply: "build",
		enforce: "post",
		async generateBundle(_options, bundle) {
			for (const file of Object.values(bundle)) {
				if (file.type === "asset" && file.fileName.endsWith(".css")) {
					const result = await processor.process(String(file.source), {
						from: undefined,
					})
					file.source = result.css
				}
			}
		},
	}
}

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
		legacyCssPlugin(),
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
		// Chrome 83 supports ES modules, so only inject polyfills into the modern bundle
		legacy({
			targets: ["chrome >= 83"],
			renderLegacyChunks: false,
			modernPolyfills: true,
		}),
	],
	css: {
		transformer: "lightningcss",
		lightningcss: {
			targets: { chrome: CHROME_83 },
		},
	},
	// Specifically for Mobile this is our target
	build: {
		target: "chrome83",
		cssTarget: "chrome83",
		cssMinify: "lightningcss",
	},
})

export default config
