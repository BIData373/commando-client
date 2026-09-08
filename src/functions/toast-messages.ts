import { ErrorCode } from "src/utils/error-utils"

/** A bare string when the copy never varies, or singular plus a plural form. */
export type ToastCopy =
	| string
	| { one: string; many: (amount: number) => string }

export function count(copy: ToastCopy, amount: number): string {
	if (typeof copy === "string") return copy
	if (amount === 1) return copy.one

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

export const updateDiscussionMessage = "פרטי הדיון עודכנו בהצלחה"

export const createEnvironmentMessage = "הסביבה נוצרה בהצלחה"

export const updateEnvironmentMessage = "פרטי הסביבה עודכנו בהצלחה"

export const addResponsibleMessage = "האחראי נוסף בהצלחה"

export const updateResponsibleMessage = "פרטי האחראי עודכנו בהצלחה"

export const removeResponsibleMessage = "האחראי הוסר בהצלחה"

export const updatePermissionsMessage = "הרשאות המשתמש עודכנו בהצלחה"

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

export const FAILURE_BY_STATUS: Partial<Record<ErrorCode, string>> = {
	[ErrorCode.UNAUTHORIZED]: NO_PERMISSION,
	[ErrorCode.BAD_REQUEST]: MISSING_REQUIRED_FIELD,
}
