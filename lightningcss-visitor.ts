import type { Declaration, TokenOrValue, Visitor } from "lightningcss"

const ROTATE_VAR = "--chrome83-rotate"

const COMMA: TokenOrValue = { type: "token", value: { type: "comma" } }
const SPACE: TokenOrValue = {
	type: "token",
	value: { type: "white-space", value: " " },
}

function dimension(value: number, unit: string): TokenOrValue {
	return { type: "token", value: { type: "dimension", value, unit } }
}

function number(value: number): TokenOrValue {
	return { type: "token", value: { type: "number", value } }
}

function varWithFallback(name: string, fallback: TokenOrValue): TokenOrValue {
	return { type: "var", value: { name: { ident: name }, fallback: [fallback] } }
}

function fn(name: string, args: TokenOrValue[]): TokenOrValue {
	return { type: "function", value: { name, arguments: args } }
}

function unparsed(property: string, value: TokenOrValue[]): Declaration {
	return {
		property: "unparsed",
		value: { propertyId: { property }, value },
	} as Declaration
}

function customProperty(name: string, value: TokenOrValue[]): Declaration {
	return { property: "custom", value: { name, value } } as Declaration
}

// Chrome 83 lacks the individual transform properties (Chrome 104+). Every
// translate/rotate/scale rule becomes the same full `transform`, in the order the
// individual properties compose, so utilities combined on one element don't clobber
// each other. Fallbacks cover Chrome 83 ignoring Tailwind's @property initial values.
const COMBINED_TRANSFORM = unparsed("transform", [
	fn("translate", [
		varWithFallback("--tw-translate-x", number(0)),
		COMMA,
		varWithFallback("--tw-translate-y", number(0)),
	]),
	SPACE,
	fn("rotate", [varWithFallback(ROTATE_VAR, dimension(0, "deg"))]),
	SPACE,
	fn("scale", [
		varWithFallback("--tw-scale-x", number(1)),
		COMMA,
		varWithFallback("--tw-scale-y", number(1)),
	]),
])

// Lightning CSS serializes absent optional fields as null but fails to deserialize them back
function withoutNulls(tokens: TokenOrValue[]): TokenOrValue[] {
	return JSON.parse(
		JSON.stringify(tokens, (_key, value) =>
			value === null ? undefined : value,
		),
	)
}

function splitOnWhitespace(tokens: TokenOrValue[]): TokenOrValue[][] {
	const groups: TokenOrValue[][] = [[]]

	for (const token of tokens) {
		if (token.type === "token" && token.value.type === "white-space") {
			groups.push([])
		} else {
			groups[groups.length - 1].push(token)
		}
	}

	return groups.filter((group) => group.length > 0)
}

// Lightning CSS cannot expand `inset` when the value contains var(), and Chrome 83 lacks it (Chrome 87+)
function toInsetLonghands(tokens: TokenOrValue[]): Declaration[] {
	const [top, right = top, bottom = top, left = right] =
		splitOnWhitespace(tokens)

	return [
		unparsed("top", top),
		unparsed("right", right),
		unparsed("bottom", bottom),
		unparsed("left", left),
	]
}

export const chrome83Visitor: Visitor<never> = {
	Declaration(declaration) {
		if (declaration.property === "rotate") {
			const { x, y, z, angle } = declaration.value

			if (x !== 0 || y !== 0 || z !== 1) {
				return
			}

			return [
				customProperty(ROTATE_VAR, [dimension(angle.value, angle.type)]),
				COMBINED_TRANSFORM,
			]
		}

		if (declaration.property !== "unparsed") {
			return
		}

		const { propertyId } = declaration.value

		if (propertyId.property === "rotate") {
			return [
				customProperty(ROTATE_VAR, withoutNulls(declaration.value.value)),
				COMBINED_TRANSFORM,
			]
		}

		if (propertyId.property === "translate" || propertyId.property === "scale") {
			return COMBINED_TRANSFORM
		}

		if (propertyId.property === "inset") {
			return toInsetLonghands(withoutNulls(declaration.value.value))
		}
	},
}
