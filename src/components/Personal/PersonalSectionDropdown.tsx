import { useRenderInHeader } from "src/providers/HeaderProvider"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import {
	ArchiveDropdown,
	type DropdownSection,
} from "../shared/ArchiveDropdown"
import { NavigationMenu, NavigationMenuList } from "../ui/navigation-menu"

interface PersonalSectionDropdownProps {
	current: DropdownSection
}

export function PersonalSectionDropdown({
	current,
}: PersonalSectionDropdownProps) {
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
					section={current}
					isActive={true}
				/>
			</NavigationMenuList>
		</NavigationMenu>,
		[current],
	)

	return null
}
