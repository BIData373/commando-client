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
// Tells styles.css to space Tailwind gap-* flex containers with margins
document.documentElement.classList.toggle("no-flex-gap", !flexGapSupported)

interface FlexContainer {
	direction?: string
	gap?: string
}

const flexContainers = new Map<string, FlexContainer>()

// Single-value `gap` becomes margins between flex children, also when a media
// query overrides it; wrapping is not handled
const flexGapMiddleware: Middleware = (
	element,
	_index,
	_children,
	callback,
) => {
	const media = element.root?.type === "@media"

	if (
		flexGapSupported ||
		element.type !== RULESET ||
		(element.root && !media)
	) {
		return
	}

	const styles = new Map(
		(element.children as Element[])
			.filter((child) => child.type === DECLARATION)
			.map((child) => [child.props as string, child.children as string]),
	)
	const key = String(element.props)

	if (!media && styles.get("display")?.endsWith("flex")) {
		flexContainers.set(key, {
			direction: styles.get("flex-direction"),
			gap: styles.get("gap"),
		})
	}

	const base = flexContainers.get(key)
	const gap = styles.get("gap") ?? base?.gap
	const column = (styles.get("flex-direction") ?? base?.direction)?.startsWith(
		"column",
	)

	if (
		!gap ||
		!base ||
		(media && !styles.has("gap") && !styles.has("flex-direction"))
	) {
		return
	}

	const selector = (element.props as string[]).map((prop) => `${prop}>*+*`)
	const margins = media
		? `margin-inline-start:${column ? 0 : gap};margin-block-start:${column ? gap : 0}`
		: `${column ? "margin-block-start" : "margin-inline-start"}:${gap}`
	const rule = `${selector}{${margins}}`

	return serialize(
		compile(media ? `${element.root?.value}{${rule}}` : rule),
		callback,
	)
}

// Emits physical fallbacks only for logical properties the browser lacks (Chrome < 87)
export const emotionCache = createCache({
	key: "css",
	stylisPlugins: [flexGapMiddleware, logicalPropsMiddleware],
})
