import type { Mutation } from "@tanstack/react-query"
import { MutationCache } from "@tanstack/react-query"
import { CreateWorkspaceErrorDtoMessage, type ErrorDto } from "src/api/model"
import type { ErrorType } from "src/axios"
import { toast } from "src/components/Toast/toast-api"
import type { AppToastOptions } from "src/components/Toast/toast-types"
import { ErrorCode } from "src/utils/error-utils"

// ─── Messages ───────────────────────────────────────────────────────────────

/** Stands in for a count in the plural messages, per the product spec. */
const COUNT_PLACEHOLDER = "X"

export enum MutationSuccess {
	CreateGuideline = "ההנחיה נוצרה בהצלחה",
	CreateGuidelines = "X הנחיות נוצרו בהצלחה",
	UpdateGuideline = "ההנחיה עודכנה בהצלחה",
	UpdateGuidelines = "X הנחיות עודכנו בהצלחה",
	DeleteGuideline = "ההנחיה נמחקה בהצלחה",
	DeleteGuidelines = "X הנחיות נמחקו בהצלחה",
	UpdateStatus = "סטטוס ההנחיה עודכן בהצלחה",
	UpdateStatuses = "סטטוס X הנחיות עודכן בהצלחה",
	ArchiveGuideline = "ההנחיה הועברה לארכיון בהצלחה",
	ArchiveGuidelines = "X הנחיות הועברו לארכיון בהצלחה",
	UnarchiveGuideline = "ההנחיה הוחזרה מהארכיון בהצלחה",
	UnarchiveGuidelines = "X הנחיות הוחזרו מהארכיון בהצלחה",
	/**
	 * Unused: the only environment flow today is `createWorkspaceRequest`, which
	 * creates a pending request rather than an environment and reports through
	 * its own success step. Kept for the eventual approval path.
	 */
	CreateEnvironment = "הסביבה נוצרה בהצלחה",
	UpdateEnvironmentDetails = "פרטי הסביבה עודכנו בהצלחה",
	AddResponsible = "האחראי נוסף בהצלחה",
	UpdateResponsible = "פרטי האחראי עודכנו בהצלחה",
	RemoveResponsible = "האחראי הוסר בהצלחה",
	UpdatePermissions = "הרשאות המשתמש עודכנו בהצלחה",
	UpdateDiscussionDetails = "פרטי הדיון עודכנו בהצלחה",
}

export enum MutationFailure {
	NoPermission = "אין לך הרשאה לבצע פעולה זו",
	DuplicateEnvironmentName = "קיימת כבר סביבה בשם זה, נא לבחור שם אחר",
	MissingRequiredField = "לא ניתן לשמור, אנא מלא את כל השדות הנדרשים",
	RequiredEnvironmentName = "שם סביבה הוא שדה חובה",
	ArchiveFailed = "ההעברה לארכיון נכשלה",
	UndoArchiveFailed = "ביטול ההעברה לארכיון נכשל",
	/**
	 * The spec labels both the network and the data-saving failures only as
	 * "כשל טכני" without literal copy, so both reuse the wording `ErrorModal`
	 * already shows for a technical failure.
	 */
	TechnicalFailure = "משהו השתבש בתקשורת",
}

export const TECHNICAL_FAILURE_SUBTITLE =
	"כדאי לנסות שוב בעוד מספר רגעים אם הבעיה נמשכת, פנו אלינו לעזרה"

export const UNDO_LABEL = "ביטול"

/** Picks the singular or plural message, interpolating the count into it. */
export function withCount(
	count: number,
	singular: MutationSuccess,
	plural: MutationSuccess,
): string {
	return count === 1
		? singular
		: plural.replace(COUNT_PLACEHOLDER, String(count))
}

/** Adds the "try again / contact us" line to the generic failure copy only. */
export function showFailureToast(message: string) {
	toast.error(message, {
		subtitle:
			message === MutationFailure.TechnicalFailure
				? TECHNICAL_FAILURE_SUBTITLE
				: undefined,
	})
}

// ─── Call-site overrides ────────────────────────────────────────────────────

/** Per-call override of an operation's default messages. */
export type MutationToastConfig = {
	/**
	 * `false` suppresses the toast, e.g. when a batch aggregates its own;
	 * `true` uses the operation's registry entry, as omitting it would.
	 * The builder form receives the mutation's result; it is typed `unknown`
	 * because `meta` is declared globally and cannot infer the hook's `TData`.
	 */
	success?: string | ((data: unknown, variables: unknown) => string) | boolean
	/**
	 * `false` suppresses the toast; `true` reports the failure even when the
	 * operation is absent from the registry.
	 */
	error?: string | boolean
}

/**
 * App-wide mutation `meta`. Declared as a `type` rather than an `interface` on
 * purpose: TanStack resolves `MutationMeta` via
 * `Register extends { mutationMeta: infer T } ? T extends Record<string, unknown> ...`,
 * and an interface has no implicit index signature, so it would silently fall
 * back to `Record<string, unknown>` and lose every field below.
 *
 * `meta` is a single global slot, so each concern gets its own key here.
 */
export type AppMutationMeta = {
	toast?: MutationToastConfig
}

declare module "@tanstack/react-query" {
	interface Register {
		mutationMeta: AppMutationMeta
	}
}

/**
 * Silences a mutation that runs once per item in a batch, so the caller can
 * report a single aggregated result instead of one toast per item. Grep this
 * constant to find every batch call site.
 */
export const SILENT_MUTATION_META: AppMutationMeta = {
	toast: { success: false, error: false },
}

// ─── Batches ────────────────────────────────────────────────────────────────

export interface BatchResult {
	succeeded: number
	failed: number
}

/** Runs one mutation per item and tallies the outcomes. */
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
	singular: MutationSuccess
	plural: MutationSuccess
	/** `false` when the caller reports failures itself, e.g. across two batches. */
	failure?: MutationFailure | false
	/** Extra toast options for the success message, such as an undo action. */
	options?: AppToastOptions
}

/** Reports a batch as one success toast plus at most one failure toast. */
export function reportBatch(
	{ succeeded, failed }: BatchResult,
	{
		singular,
		plural,
		failure = MutationFailure.TechnicalFailure,
		options,
	}: BatchReport,
) {
	if (succeeded > 0) {
		toast.success(withCount(succeeded, singular, plural), options)
	}

	if (failed > 0 && failure !== false) {
		showFailureToast(failure)
	}
}

// ─── Operation registry ─────────────────────────────────────────────────────

/** Mutation keys, which orval names after the operation. */
export enum MutationOperation {
	CreateTask = "createTask",
	UpdateTask = "updateTask",
	DeleteTask = "deleteTask",
	CreateSource = "createSource",
	UpdateSource = "updateSource",
	CreateAssignee = "createAssignee",
	UpdateAssignee = "updateAssignee",
	DeleteAssignee = "deleteAssignee",
	UpsertPermission = "upsertPermission",
	DeletePermission = "deletePermission",
	UpsertAssigneeTaskStatus = "upsertAssigneeTaskStatus",
	CreateMessage = "createMessage",
	DeleteMessage = "deleteMessage",
	ToggleUserTaskArchive = "toggleUserTaskArchive",
	ToggleWorkspaceTaskArchive = "toggleWorkspaceTaskArchive",
	UpdateWorkspace = "updateWorkspace",
	/** Hand-written in `useUpdateTaskStatus`, which sets this key itself. */
	UpdateTaskStatus = "updateTaskStatus",
}

interface OperationToasts {
	/** Omit to report only failures. */
	success?: MutationSuccess
	/** Messages for specific server error codes, from `ErrorDto.message`. */
	failures?: Record<string, MutationFailure>
}

const DUPLICATE_ENVIRONMENT_NAME: Record<string, MutationFailure> = {
	[CreateWorkspaceErrorDtoMessage["title-exists"]]:
		MutationFailure.DuplicateEnvironmentName,
	[CreateWorkspaceErrorDtoMessage["urlname-exists"]]:
		MutationFailure.DuplicateEnvironmentName,
}

/**
 * Operations that report their result to the user.
 *
 * An entry opts the operation into failure toasts; adding `success` also opts
 * it into a success toast. Operations absent from this map stay silent —
 * background writes the user never explicitly asked for, such as persisting
 * table preferences, should not announce themselves or their failures. A call
 * site can still opt in for a one-off through `meta.toast`.
 *
 * Entries without a `success` message have callers that announce their own
 * result, but a silent failure there would be the worst outcome.
 */
const REPORTED_OPERATIONS: Partial<Record<MutationOperation, OperationToasts>> =
	{
		[MutationOperation.CreateTask]: {
			success: MutationSuccess.CreateGuideline,
		},
		[MutationOperation.UpdateTask]: {
			success: MutationSuccess.UpdateGuideline,
		},
		[MutationOperation.DeleteTask]: {
			success: MutationSuccess.DeleteGuideline,
		},
		[MutationOperation.CreateSource]: {},
		[MutationOperation.UpdateSource]: {
			success: MutationSuccess.UpdateDiscussionDetails,
		},
		[MutationOperation.CreateAssignee]: {
			success: MutationSuccess.AddResponsible,
		},
		[MutationOperation.UpdateAssignee]: {
			success: MutationSuccess.UpdateResponsible,
		},
		[MutationOperation.DeleteAssignee]: {
			success: MutationSuccess.RemoveResponsible,
		},
		[MutationOperation.UpsertPermission]: {
			success: MutationSuccess.UpdatePermissions,
		},
		[MutationOperation.DeletePermission]: {
			success: MutationSuccess.UpdatePermissions,
		},
		[MutationOperation.UpsertAssigneeTaskStatus]: {
			success: MutationSuccess.UpdateStatus,
		},
		[MutationOperation.UpdateTaskStatus]: {
			success: MutationSuccess.UpdateStatus,
		},
		[MutationOperation.UpdateWorkspace]: {
			success: MutationSuccess.UpdateEnvironmentDetails,
			failures: DUPLICATE_ENVIRONMENT_NAME,
		},
		[MutationOperation.CreateMessage]: {},
		[MutationOperation.DeleteMessage]: {},
		[MutationOperation.ToggleUserTaskArchive]: {},
		[MutationOperation.ToggleWorkspaceTaskArchive]: {},
	}

const FAILURE_BY_STATUS: Partial<Record<ErrorCode, MutationFailure>> = {
	[ErrorCode.UNAUTHORIZED]: MutationFailure.NoPermission,
	[ErrorCode.BAD_REQUEST]: MutationFailure.MissingRequiredField,
}

// ─── Global wiring ──────────────────────────────────────────────────────────

type AnyMutation = Mutation<unknown, unknown, unknown>

function getOperationToasts(mutation: AnyMutation) {
	const [operation] = mutation.options.mutationKey ?? []
	return REPORTED_OPERATIONS[operation as MutationOperation]
}

function resolveSuccessMessage(
	mutation: AnyMutation,
	data: unknown,
	variables: unknown,
) {
	const { success } = mutation.meta?.toast ?? {}
	if (success === false) return undefined

	// `true` means "whatever the registry says", same as omitting it.
	const override = success === true ? undefined : success
	const message = override ?? getOperationToasts(mutation)?.success
	if (message === undefined) return undefined

	return typeof message === "function" ? message(data, variables) : message
}

function resolveFailureMessage(mutation: AnyMutation, error: unknown) {
	const { error: override } = mutation.meta?.toast ?? {}
	if (override === false) return undefined
	if (typeof override === "string") return override

	// Operations outside the registry are background work and stay silent,
	// unless the call site opts in explicitly with `error: true`.
	const config = getOperationToasts(mutation)
	if (!config && override !== true) return undefined

	const response = (error as ErrorType<ErrorDto>)?.response

	// No response at all means the request never reached the server.
	if (!response) return MutationFailure.TechnicalFailure

	// The server sends either a single error code or a list of them.
	const { message } = response.data ?? {}
	const codes = Array.isArray(message) ? message : [message]
	const mapped = codes
		.map((code) => config?.failures?.[code])
		.find((match) => match !== undefined)

	return (
		mapped ??
		FAILURE_BY_STATUS[response.status as ErrorCode] ??
		MutationFailure.TechnicalFailure
	)
}

/**
 * Reports every mutation result through a toast.
 *
 * This lives on the cache rather than in `defaultOptions.mutations` because
 * default options are merged by replacement: a hook passing its own
 * `onSuccess` — which most call sites do, to invalidate queries — would
 * silently drop the default. Cache callbacks always run in addition, and they
 * run before the mutation's own.
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
