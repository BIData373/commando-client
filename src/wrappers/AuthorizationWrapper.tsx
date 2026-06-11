import { AxiosError } from "axios"
import { type PropsWithChildren, useMemo } from "react"
import { PermissionType } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { useErrorHandler } from "src/providers/ErrorModalProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"

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

	const { data: myPermission, error: permissionError } = useGetMyPermission({
		workspaceId,
	})

	const permitted =
		!myPermission || allowedTypes[type].includes(myPermission.type)
	const permittedError = useMemo(
		() =>
			myPermission && !permitted ? new AxiosError(undefined, "403") : null,
		[myPermission, permitted],
	)

	useErrorHandler(permissionError, permittedError)

	return myPermission && children
}
