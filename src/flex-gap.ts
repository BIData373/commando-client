import {
	compile,
	DECLARATION,
	type Element,
	type Middleware,
	RULESET,
	serialize,
} from "stylis"

// Flexbox gap needs Chrome 84, and CSS.supports cannot tell it from grid gap
function detectFlexGapSupport(): boolean {
	const probe = document.createElement("div")
	probe.style.cssText = "display:flex;flex-direction:column;gap:1px"
	probe.innerHTML = '<i style="height:1px"></i><i style="height:1px"></i>'
	document.body.appendChild(probe)
	const supported = probe.scrollHeight === 3
	probe.remove()
	return supported
}

const flexGapSupported = detectFlexGapSupport()

// Lets styles.css space Tailwind gap-* containers with margins where gap is missing
document.documentElement.classList.toggle("no-flex-gap", !flexGapSupported)

interface FlexContainer {
	direction?: string
	gap?: string
}

// Base direction and gap per selector, so a media query can override only one of them
const flexContainers = new Map<string, FlexContainer>()

function readDeclarations(rule: Element): Map<string, string> {
	return new Map(
		(rule.children as Element[])
			.filter((child) => child.type === DECLARATION)
			.map((child) => [child.props as string, child.children as string]),
	)
}

function spacingDeclarations(
	gap: string,
	isColumn: boolean | undefined,
	isOverride: boolean,
): string {
	if (isOverride) {
		// Reset the base axis, since the override may switch row to column or back
		return `margin-inline-start:${isColumn ? 0 : gap};margin-block-start:${isColumn ? gap : 0}`
	}

	return `${isColumn ? "margin-block-start" : "margin-inline-start"}:${gap}`
}

// Falls back to margins between flex children wherever a rule sets `gap`, including
// media query overrides. Wrapping, reversed directions and two-value gaps are not handled.
export const flexGapMiddleware: Middleware = (
	rule,
	_index,
	_children,
	callback,
) => {
	const isOverride = rule.root?.type === "@media"
	const isNested = Boolean(rule.root) && !isOverride

	if (flexGapSupported || rule.type !== RULESET || isNested) {
		return
	}

	const declarations = readDeclarations(rule)
	const selectorKey = String(rule.props)

	if (!isOverride && declarations.get("display")?.endsWith("flex")) {
		flexContainers.set(selectorKey, {
			direction: declarations.get("flex-direction"),
			gap: declarations.get("gap"),
		})
	}

	const base = flexContainers.get(selectorKey)
	const changesSpacing =
		declarations.has("gap") || declarations.has("flex-direction")
	const gap = declarations.get("gap") ?? base?.gap
	const direction = declarations.get("flex-direction") ?? base?.direction

	if (!base || !gap || (isOverride && !changesSpacing)) {
		return
	}

	const childSelector = (rule.props as string[]).map((prop) => `${prop}>*+*`)
	const spacing = spacingDeclarations(
		gap,
		direction?.startsWith("column"),
		isOverride,
	)
	const css = `${childSelector}{${spacing}}`

	return serialize(
		compile(isOverride ? `${rule.root?.value}{${css}}` : css),
		callback,
	)
}
