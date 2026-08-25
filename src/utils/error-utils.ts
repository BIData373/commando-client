import type { ErrorType } from "src/axios"

export enum ErrorCode {
	BAD_REQUEST = 400,
	UNAUTHORIZED = 403,
	NOT_FOUND = 404,
	SERVER_ERROR = 500,
}

export const isErrorCode = (code: number) =>
	Object.values(ErrorCode).includes(code)

const titleExistError = "title-exists"
type ApiError = ErrorType<{ message: string | string[] }>

function getMessages(error: ErrorType<unknown>) {
	const messages = (error as ApiError)?.response?.data?.message
	return Array.isArray(messages) ? messages : [messages]
}

export function isWorkspaceExist(error: ErrorType<unknown>) {
	return getMessages(error).includes(titleExistError)
}

export function isUrlNameExist(error: ErrorType<unknown>) {
	return getMessages(error).includes("url-name-exists")
}
