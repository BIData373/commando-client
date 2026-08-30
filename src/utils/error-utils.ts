import type { ErrorDto } from "src/api/model"
import type { ErrorType } from "src/axios"

export enum ErrorCode {
	BAD_REQUEST = 400,
	UNAUTHORIZED = 403,
	NOT_FOUND = 404,
	SERVER_ERROR = 500,
}

export const isErrorCode = (code: number) =>
	Object.values(ErrorCode).includes(code)

export function hasError<T extends ErrorDto>(
	error: ErrorType<T>,
	code: T["message"],
) {
	const message = error.response?.data?.message
	const messages = Array.isArray(message) ? message : [message]
	return messages.includes(code)
}
