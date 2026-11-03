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

// Flexbox gap needs Chrome 84; grid gap alone does not tell us, so measure it
function supportsFlexGap(): boolean {
	const flex = document.createElement("div")
	flex.style.cssText = "display:flex;flex-direction:column;gap:1px"
	flex.innerHTML = '<i style="height:1px"></i><i style="height:1px"></i>'
	document.body.appendChild(flex)
	const supported = flex.scrollHeight === 3
	flex.remove()
	return supported
}

const flexGapSupported = supportsFlexGap()

// Falls back to margins between flex children; wrapped lines are not handled
const flexGapMiddleware: Middleware = (
	element,
	_index,
	_children,
	callback,
) => {
	if (flexGapSupported || element.type !== RULESET || element.root !== null) {
		return
	}

	const declarations = new Map(
		(element.children as Element[])
			.filter((child) => child.type === DECLARATION)
			.map((child) => [child.props as string, child.children as string]),
	)

	if (!declarations.get("display")?.endsWith("flex")) {
		return
	}

	const isColumn = declarations.get("flex-direction")?.startsWith("column")
	const [row, column = row] =
		declarations.get("gap")?.split(/ (?![^(]*\))/) ?? []
	const gap = isColumn
		? (declarations.get("row-gap") ?? row)
		: (declarations.get("column-gap") ?? column)

	if (!gap) {
		return
	}

	const selector = (element.props as string[])
		.map((prop) => `${prop}>*+*`)
		.join(",")
	const margin = isColumn ? "margin-block-start" : "margin-inline-start"

	return serialize(compile(`${selector}{${margin}:${gap}}`), callback)
}

// Emits physical fallbacks only for logical properties the browser lacks (Chrome < 87)
export const emotionCache = createCache({
	key: "css",
	stylisPlugins: [flexGapMiddleware, logicalPropsMiddleware],
})
