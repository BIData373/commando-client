import {
	WorkspaceStatusType as StatusType,
	type WorkspaceStatusDto,
	type WorkspaceStatusType,
} from "src/api/model"

export const STATUS_DEFAULTS: Record<
	WorkspaceStatusType,
	Pick<WorkspaceStatusDto, "name" | "color">
> = {
	[StatusType.NOT_STARTED]: { name: "טרם בוצע", color: "#FA541C" },
	[StatusType.IN_PROGRESS]: { name: "בעבודה", color: "#2F54EB" },
	[StatusType.COMPLETED]: { name: "בוצע", color: "#52c41a" },
}
