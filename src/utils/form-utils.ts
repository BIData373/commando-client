import type { AnyFormApi } from "@tanstack/form-core"
import { isEqual } from "lodash"

export function getChangedFields<T extends object>(
	form: AnyFormApi,
): Partial<T> {
	const values = form.state.values as T
	const defaults = (form.options.defaultValues ?? {}) as T

	return (Object.keys(values) as (keyof T)[]).reduce<Partial<T>>((acc, key) => {
		if (!isEqual(values[key], defaults[key])) {
			acc[key] = values[key]
		}
		return acc
	}, {})
}
