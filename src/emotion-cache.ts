import createCache from "@emotion/cache"
import logicalPropsMiddleware from "@rocket.chat/stylis-logical-props-middleware"
import {
	compile,
	DECLARATION,
	type Element,
	type Middleware,
	RULESET,
	serialize,
} from "stylis"

// Flexbox gap needs Chrome 84, and CSS.supports cannot tell it from grid gap
const probe = document.createElement("div")
probe.style.cssText = "display:flex;flex-direction:column;gap:1px"
probe.innerHTML = '<i style="height:1px"></i><i style="height:1px"></i>'
document.body.appendChild(probe)
const flexGapSupported = probe.scrollHeight === 3
probe.remove()

// Single-value `gap` becomes margins between flex children; wrapping is not handled
const flexGapMiddleware: Middleware = (
	element,
	_index,
	_children,
	callback,
) => {
	if (flexGapSupported || element.type !== RULESET || element.root !== null) {
		return
	}

	const styles = new Map(
		(element.children as Element[])
			.filter((child) => child.type === DECLARATION)
			.map((child) => [child.props as string, child.children as string]),
	)
	const gap = styles.get("gap")

	if (!gap || !styles.get("display")?.endsWith("flex")) {
		return
	}

	const margin = styles.get("flex-direction")?.startsWith("column")
		? "margin-block-start"
		: "margin-inline-start"
	const selector = (element.props as string[]).map((prop) => `${prop}>*+*`)

	return serialize(compile(`${selector}{${margin}:${gap}}`), callback)
}

// Emits physical fallbacks only for logical properties the browser lacks (Chrome < 87)
export const emotionCache = createCache({
	key: "css",
	stylisPlugins: [flexGapMiddleware, logicalPropsMiddleware],
})
