import {
	type WorkspaceErrorDto,
	WorkspaceErrorDtoMessage,
	type WorkspaceRequestErrorDto,
} from "src/api/model"
import type { ErrorType } from "src/axios"

export enum ErrorCode {
	BAD_REQUEST = 400,
	UNAUTHORIZED = 403,
	NOT_FOUND = 404,
	SERVER_ERROR = 500,
}

export const isErrorCode = (code: number) =>
	Object.values(ErrorCode).includes(code)

type WorkspaceError = ErrorType<WorkspaceErrorDto | WorkspaceRequestErrorDto>

function getMessages(error: WorkspaceError) {
	const message = error.response?.data?.message
	return Array.isArray(message) ? message : [message]
}

export function isTitleExists(error: WorkspaceError) {
	return getMessages(error).includes(WorkspaceErrorDtoMessage["title-exists"])
}

export function isUrlNameExists(error: WorkspaceError) {
	return getMessages(error).includes(WorkspaceErrorDtoMessage["urlname-exists"])
}

export function isPikudNotFound(error: WorkspaceError) {
	return getMessages(error).includes(
		WorkspaceErrorDtoMessage["pikud-not-found"],
	)
}
