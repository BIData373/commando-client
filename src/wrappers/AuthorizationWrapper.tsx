import { type PropsWithChildren, useMemo } from "react"
import { PermissionType } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { useErrorHandler } from "src/providers/ErrorModalProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { ErrorCode } from "src/utils/error-utils"

const allowedTypes: Record<PermissionType, PermissionType[]> = {
	[PermissionType.VIEWER]: [PermissionType.VIEWER, PermissionType.MANAGER],
	[PermissionType.MANAGER]: [PermissionType.MANAGER],
}

interface AuthorizationWrapperProps extends PropsWithChildren {
	type: PermissionType
}

export function AuthorizationWrapper({
	type,
	children,
}: AuthorizationWrapperProps) {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	const {
		data: myPermission,
		isFetched,
		error: permissionError,
	} = useGetMyPermission({
		workspaceId,
	})

	const permittedError = useMemo(
		() =>
			isFetched &&
			!(myPermission && allowedTypes[type].includes(myPermission.type))
				? ErrorCode.UNAUTHORIZED
				: null,
		[myPermission, type, isFetched],
	)

	useErrorHandler(permissionError?.status, permittedError)

	return myPermission && children
}
