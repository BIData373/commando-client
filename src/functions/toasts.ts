import type { Mutation } from "@tanstack/react-query"
import { MutationCache } from "@tanstack/react-query"
import type { ErrorDto } from "src/api/model"
import type { ErrorType } from "src/axios"
import { toast } from "src/components/Toast/toast-api"
import type { AppToastOptions } from "src/components/Toast/toast-types"
import { ErrorCode } from "src/utils/error-utils"

// ─── Copy ───────────────────────────────────────────────────────────────────

export interface ToastCopy {
	one: string
	many?: (amount: number) => string
}

export function count(copy: ToastCopy, amount: number): string {
	if (amount === 1 || !copy.many) {
		return copy.one
	}

	return copy.many(amount)
}

export const createTaskMessage: ToastCopy = {
	one: "ההנחיה נוצרה בהצלחה",
	many: (amount) => `${amount} הנחיות נוצרו בהצלחה`,
}

export const updateTaskMessage: ToastCopy = {
	one: "ההנחיה עודכנה בהצלחה",
	many: (amount) => `${amount} הנחיות עודכנו בהצלחה`,
}

export const deleteTaskMessage: ToastCopy = {
	one: "ההנחיה נמחקה בהצלחה",
	many: (amount) => `${amount} הנחיות נמחקו בהצלחה`,
}

export const updateStatusMessage: ToastCopy = {
	one: "סטטוס ההנחיה עודכן בהצלחה",
	many: (amount) => `סטטוס ${amount} הנחיות עודכן בהצלחה`,
}

export const archiveTaskMessage: ToastCopy = {
	one: "ההנחיה הועברה לארכיון בהצלחה",
	many: (amount) => `${amount} הנחיות הועברו לארכיון בהצלחה`,
}

export const unarchiveTaskMessage: ToastCopy = {
	one: "ההנחיה הוחזרה מהארכיון בהצלחה",
	many: (amount) => `${amount} הנחיות הוחזרו מהארכיון בהצלחה`,
}

export const updateDiscussionMessage: ToastCopy = {
	one: "פרטי הדיון עודכנו בהצלחה",
}

export const createEnvironmentMessage: ToastCopy = {
	one: "הסביבה נוצרה בהצלחה",
}

export const updateEnvironmentMessage: ToastCopy = {
	one: "פרטי הסביבה עודכנו בהצלחה",
}

export const addResponsibleMessage: ToastCopy = { one: "האחראי נוסף בהצלחה" }

export const updateResponsibleMessage: ToastCopy = {
	one: "פרטי האחראי עודכנו בהצלחה",
}

export const removeResponsibleMessage: ToastCopy = { one: "האחראי הוסר בהצלחה" }

export const updatePermissionsMessage: ToastCopy = {
	one: "הרשאות המשתמש עודכנו בהצלחה",
}

const NO_PERMISSION = "אין לך הרשאה לבצע פעולה זו"
export const DUPLICATE_ENVIRONMENT_NAME =
	"קיימת כבר סביבה בשם זה, נא לבחור שם אחר"
const MISSING_REQUIRED_FIELD = "לא ניתן לשמור, אנא מלא את כל השדות הנדרשים"
export const REQUIRED_ENVIRONMENT_NAME = "שם סביבה הוא שדה חובה"
export const ARCHIVE_FAILED = "ההעברה לארכיון נכשלה"
export const UNDO_ARCHIVE_FAILED = "ביטול ההעברה לארכיון נכשל"
export const TECHNICAL_FAILURE = "משהו השתבש בתקשורת"
export const TECHNICAL_FAILURE_SUBTITLE =
	"כדאי לנסות שוב בעוד מספר רגעים אם הבעיה נמשכת, פנו אלינו לעזרה"

export const UNDO_LABEL = "ביטול"

const FAILURE_BY_STATUS: Partial<Record<ErrorCode, string>> = {
	[ErrorCode.UNAUTHORIZED]: NO_PERMISSION,
	[ErrorCode.BAD_REQUEST]: MISSING_REQUIRED_FIELD,
}

// ─── Reporting ──────────────────────────────────────────────────────────────

export function showFailureToast(message: string) {
	toast.error(message, {
		subtitle:
			message === TECHNICAL_FAILURE ? TECHNICAL_FAILURE_SUBTITLE : undefined,
	})
}

interface BatchResult {
	succeeded: number
	failed: number
}

export async function runBatch<TItem>(
	items: TItem[],
	run: (item: TItem) => Promise<unknown>,
): Promise<BatchResult> {
	const results = await Promise.allSettled(items.map(run))
	const succeeded = results.filter(
		({ status }) => status === "fulfilled",
	).length

	return { succeeded, failed: results.length - succeeded }
}

interface BatchReport {
	message: ToastCopy
	/** `false` when the caller reports failures itself, e.g. across two batches. */
	failure?: string | false
	options?: AppToastOptions
}

export function reportBatch(
	{ succeeded, failed }: BatchResult,
	{ message, failure = TECHNICAL_FAILURE, options }: BatchReport,
) {
	if (succeeded > 0) {
		toast.success(count(message, succeeded), options)
	}

	if (failed > 0 && failure !== false) {
		showFailureToast(failure)
	}
}

// ─── Mutation meta ──────────────────────────────────────────────────────────

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

// ─── Global wiring ──────────────────────────────────────────────────────────

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
				showFailureToast(message)
			}
		},
	})
}
