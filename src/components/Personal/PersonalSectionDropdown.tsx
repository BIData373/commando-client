import { useRenderInHeader } from "src/providers/HeaderProvider"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import { ArchiveDropdown } from "../shared/ArchiveDropdown"
import { NavigationMenu, NavigationMenuList } from "../ui/navigation-menu"

type PersonalSection = "tasks" | "archive"

interface PersonalSectionDropdownProps {
	current: PersonalSection
}

export function PersonalSectionDropdown({
	current,
}: PersonalSectionDropdownProps) {
	const isArchive = current === "archive"

	useRenderInHeader(
		"right",
		<NavigationMenu viewport={false}>
			<NavigationMenuList>
				<ArchiveDropdown
					tasksRoute={{
						to: "/personal/tasks",
						search: { view: TasksView.TABLE },
					}}
					archiveRoute={{ to: "/personal/archive" }}
					isActive={true}
					isArchive={isArchive}
				/>
			</NavigationMenuList>
		</NavigationMenu>,
		[current],
	)

	return null
}
