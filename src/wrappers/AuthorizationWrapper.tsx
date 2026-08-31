import { type PropsWithChildren, useMemo } from "react"
import { PermissionType } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { useErrorHandler } from "src/providers/ErrorModalProvider"
import { ErrorCode } from "src/utils/error-utils"

const allowedTypes: Record<PermissionType, PermissionType[]> = {
	[PermissionType.VIEWER]: [PermissionType.VIEWER, PermissionType.MANAGER],
	[PermissionType.MANAGER]: [PermissionType.MANAGER],
}

interface AuthorizationWrapperProps extends PropsWithChildren {
	type: PermissionType
	workspaceId: number
}

export function AuthorizationWrapper({
	type,
	workspaceId,
	children,
}: AuthorizationWrapperProps) {
	const {
		data: myPermission,
		isFetched,
		error: permissionError,
	} = useGetMyPermission({
		workspaceId,
	})

	const isAuthorized =
		!!myPermission && allowedTypes[type].includes(myPermission.type)

	const permittedError = useMemo(
		() => (isFetched && !isAuthorized ? ErrorCode.UNAUTHORIZED : null),
		[isAuthorized, isFetched],
	)

	useErrorHandler(permissionError?.status, permittedError)

	return isAuthorized && children
}
