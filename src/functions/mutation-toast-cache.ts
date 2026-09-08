import type { Mutation } from "@tanstack/react-query"
import { MutationCache } from "@tanstack/react-query"
import type { ErrorDto } from "src/api/model"
import type { ErrorType } from "src/axios"
import { toast } from "src/components/Toast/toast-api"
import type { ErrorCode } from "src/utils/error-utils"
import { FAILURE_BY_STATUS, TECHNICAL_FAILURE } from "./toast-messages"

/** Both channels are opt-in: a mutation that declares nothing says nothing. */
type MutationToastConfig = {
	success?: string | ((data: unknown, variables: unknown) => string)
	/**
	 * `true` derives the message from the response, a string forces copy, and a
	 * record maps server `ErrorDto.message` codes with the derived fallback.
	 */
	error?: true | string | Record<string, string>
}

/**
 * Must stay a `type`: TanStack resolves `MutationMeta` through
 * `Register extends { mutationMeta: infer T } ? T extends Record<string, unknown> ...`,
 * and an interface has no implicit index signature, so it would silently fall
 * back to `Record<string, unknown>` and lose every field here.
 */
export type AppMutationMeta = {
	toast?: MutationToastConfig
}

declare module "@tanstack/react-query" {
	interface Register {
		mutationMeta: AppMutationMeta
	}
}

type AnyMutation = Mutation<unknown, unknown, unknown>

function resolveSuccessMessage(
	mutation: AnyMutation,
	data: unknown,
	variables: unknown,
) {
	const { success } = mutation.meta?.toast ?? {}
	if (success === undefined) return undefined

	return typeof success === "function" ? success(data, variables) : success
}

function resolveFailureMessage(mutation: AnyMutation, error: unknown) {
	const { error: config } = mutation.meta?.toast ?? {}
	if (config === undefined) return undefined
	if (typeof config === "string") return config

	const response = (error as ErrorType<ErrorDto>)?.response
	if (!response) return TECHNICAL_FAILURE

	if (typeof config === "object") {
		const { message } = response.data ?? {}
		const codes = Array.isArray(message) ? message : [message]
		const mapped = codes
			.map((code) => config[code])
			.find((match) => match !== undefined)

		if (mapped !== undefined) return mapped
	}

	return FAILURE_BY_STATUS[response.status as ErrorCode] ?? TECHNICAL_FAILURE
}

/**
 * Lives on the cache rather than `defaultOptions.mutations`, which merges by
 * replacement: a hook passing its own `onSuccess` would drop the default.
 */
export function createMutationToastCache() {
	return new MutationCache({
		onSuccess: (data, variables, _onMutateResult, mutation) => {
			const message = resolveSuccessMessage(mutation, data, variables)
			if (message !== undefined) {
				toast.success(message)
			}
		},
		onError: (error, _variables, _onMutateResult, mutation) => {
			const message = resolveFailureMessage(mutation, error)
			if (message !== undefined) {
				toast.failure(message)
			}
		},
	})
}
