import styled from "@emotion/styled"
import { useForm } from "@tanstack/react-form"
import { useMemo, useRef, useState } from "react"
import {
	getGetAssigneeQueryKey,
	getListAssigneesQueryKey,
	useCreateAssignee,
	useUpdateAssignee,
} from "src/api/assignee/assignee"
import type {
	AssigneeDto,
	AssigneesDto,
	MirageUserDto,
	UserDto,
} from "src/api/model"
import {
	getListPersonalTasksQueryKey,
	getListTasksQueryKey,
} from "src/api/task/task"
import type { IMesibaIcon } from "src/hooks/useMesiba"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { invalidateQueries, queryClient } from "src/queryClient"
import { CancelButton } from "../shared/CancelButton"
import { FormField } from "../shared/FormField"
import { ModalContent } from "../shared/ModalContent"
import { PrimaryButton } from "../shared/PrimaryButton"
import {
	Dialog,
	DialogClose,
	DialogDescription,
	DialogTitle,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { AssigneeUsersList } from "./AssigneeUsersList"
import { ColorPicker, PRESET_COLORS } from "./ColorPicker"
import { DropdownUsers } from "./DropdownUsers"
import { IconDropdown } from "./IconDropdown"

const MAX_NAME_LENGTH = 30

interface AssigneeDialogProps {
	open: boolean
	assignee?: AssigneeDto
	onOpenChange(open: boolean): void
	onCreate?(assignee: AssigneeDto): void
}

export function AssigneeDialog({
	assignee,
	open,
	onOpenChange,
	onCreate,
}: AssigneeDialogProps) {
	const isUpdate = !!assignee

	const mesibaIcon = {
		heb_name: assignee?.iconName ?? "",
		iconName: assignee?.icon ?? "",
		id: 1,
	}

	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	const [searchValue, setSearchValue] = useState<string>("")

	const [iconSearch, setIconSearch] = useState("")
	const [selectedIcon, setSelectedIcon] = useState<IMesibaIcon | null>(
		assignee?.iconName ? mesibaIcon : null,
	)

	const assigneesQueryKey = getListAssigneesQueryKey({ workspaceId })

	const handleSubmitSuccess = (data: AssigneeDto) => {
		onCreate?.(data)
		queryClient.setQueryData(assigneesQueryKey, (prev?: AssigneesDto[]) => {
			const updated = [...(prev ?? [])]
			const foundIndex = updated.findIndex(({ id }) => id === data.id)

			if (foundIndex >= 0) {
				updated[foundIndex] = { ...updated[foundIndex], ...data }
			} else {
				updated.push({ ...data, tasksCount: 0 })
			}

			return updated
		})

		// TODO - maybe somehow invalidate all tasks in this workspace that are connected?
		invalidateQueries([
			getListPersonalTasksQueryKey(),
			getListTasksQueryKey({ workspaceId }),
			...(assignee ? [getGetAssigneeQueryKey({ id: assignee.id })] : []),
		])
	}

	const { mutateAsync: createAssignee } = useCreateAssignee({
		mutation: {
			onSuccess: handleSubmitSuccess,
		},
	})
	const { mutateAsync: updateAssignee } = useUpdateAssignee({
		mutation: {
			onSuccess: handleSubmitSuccess,
		},
	})

	const randomColor = useMemo(() => {
		if (!open) {
			return
		}
		const randomColorIdx = Math.floor(
			Math.random() * (PRESET_COLORS.length - 1),
		)
		return PRESET_COLORS[randomColorIdx]
	}, [open])

	const form = useForm({
		defaultValues: {
			name: assignee?.name ?? "",
			color: assignee?.color ?? randomColor ?? PRESET_COLORS[0],
			icon: assignee?.icon ?? "",
			users: assignee?.users ?? [],
		},
		onSubmit: async ({ value }) => {
			const payload = {
				name: value.name.trim(),
				color: value.color,
				icon: value.icon || null,
				iconName: selectedIcon?.heb_name ?? "",
				users: value.users,
			}

			if (assignee) {
				await updateAssignee({
					pathParams: { id: assignee.id },
					data: payload,
				})
			} else {
				await createAssignee({
					data: { workspaceId, ...payload },
				})
			}

			onOpenChange(false)
		},
	})

	function handleKeyChange(e: React.KeyboardEvent<HTMLInputElement>) {
		if (
			e.code !== "Backspace" &&
			e.currentTarget.value.length >= MAX_NAME_LENGTH
		) {
			e.preventDefault()
		}
	}

	function handleRemoveAssignee(upn: string) {
		form.setFieldValue("users", (prev) =>
			prev.filter((user) => user.upn !== upn),
		)
	}

	function handleSearchSelect(user: MirageUserDto) {
		if (user) {
			form.setFieldValue("users", (prev) =>
				prev.some(({ upn }) => upn === user.upn)
					? prev
					: [...prev, user as UserDto],
			)
			setSearchValue("")
		}
	}

	function handleSearchClear() {
		setSearchValue("")
	}

	function handleColorChange(color: string) {
		form.setFieldValue("color", color)
	}

	function handleIconSelect(icon: IMesibaIcon) {
		form.setFieldValue("icon", icon.iconName)
		setSelectedIcon(icon)
		setIconSearch("")
	}

	function handleIconClear() {
		form.setFieldValue("icon", "")
		setSelectedIcon(null)
		setIconSearch("")
	}

	function resetForm() {
		form.setFieldValue("users", assignee?.users ?? [])
		setIconSearch("")
		setSelectedIcon(null)
		form.reset()
	}

	const scrollRef = useRef<HTMLDivElement>(null)
	const [scrollShadow, setScrollShadow] = useState({
		top: false,
		bottom: false,
	})

	function handleScroll() {
		const el = scrollRef.current
		if (!el) return
		const atTop = el.scrollTop <= 0
		const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1
		setScrollShadow({ top: !atTop, bottom: !atBottom })
	}

	function handleOpenChange(open: boolean) {
		resetForm()
		onOpenChange(open)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<AssigneeDialogContent closable={false}>
				<DialogHeader $shadow={scrollShadow.top}>
					<DialogTitleLarge>
						{isUpdate ? "עריכת אחראי" : "יצירת אחראי"}
					</DialogTitleLarge>
					<StyledDialogDescription>
						'אחראי' אליו ניתן לשייך הנחיות.
						<br />
						לכל אחראי ניתן לכתב מספר משתמשים, אשר יקבלו את ההנחיות לאזור האישי
						שלהם.
					</StyledDialogDescription>
				</DialogHeader>

				<ScrollableContent ref={scrollRef} onScroll={handleScroll}>
					<DialogBody>
						<form.Field
							name="name"
							validators={{
								onSubmit: ({ value }) =>
									!value.trim() ? "שם אחראי הוא שדה חובה" : undefined,
							}}
						>
							{(field) => (
								<FieldGroup>
									<FieldLabel>שם אחראי</FieldLabel>
									<FormField field={field}>
										<Input
											value={field.state.value}
											onKeyDown={handleKeyChange}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder='לדוגמה: מג"ד, רע"ן מפקדים, קמב"צ...'
										/>
									</FormField>
								</FieldGroup>
							)}
						</form.Field>

						<FieldGroup>
							<EitherOrRow>
								<form.Subscribe selector={(s) => s.values.color}>
									{(color) => (
										<ColorRow>
											<ColorLabel>בחר צבע לאחראי</ColorLabel>
											<ColorPicker
												selectedColor={color}
												onChange={handleColorChange}
											/>
										</ColorRow>
									)}
								</form.Subscribe>
								<OrSeparator>או</OrSeparator>
								<EmblemSection>
									<IconDropdown
										value={iconSearch}
										onChange={setIconSearch}
										onSelect={handleIconSelect}
										onClear={handleIconClear}
										selectedItem={selectedIcon ?? undefined}
									/>
								</EmblemSection>
							</EitherOrRow>
						</FieldGroup>

						<form.Field name="users">
							{(field) => (
								<FieldGroup>
									<FieldLabel>הוספת משתמשים מכותבים</FieldLabel>
									<SearchRow>
										<DropdownUsers
											value={searchValue}
											onChange={setSearchValue}
											onSelect={handleSearchSelect}
											onClear={handleSearchClear}
											showAddButton={false}
											placeholder="חפש שם/ תפקיד/ מספר אישי"
										/>
									</SearchRow>
									<AssigneeUsersList
										users={field.state.value}
										onRemove={handleRemoveAssignee}
									/>
								</FieldGroup>
							)}
						</form.Field>
					</DialogBody>
				</ScrollableContent>

				<DialogActions $shadow={scrollShadow.bottom}>
					<DialogClose asChild>
						<CancelButton title="ביטול" />
					</DialogClose>
					<PrimaryButton
						title={isUpdate ? "שמור" : "צור"}
						onClick={form.handleSubmit}
					/>
				</DialogActions>
			</AssigneeDialogContent>
		</Dialog>
	)
}

const AssigneeDialogContent = styled(ModalContent)`
  width: 700px;
  max-width: calc(100vw - 2rem);
  max-height: 70vh;
  overflow: hidden;
  direction: rtl;
`

const DialogTitleLarge = styled(DialogTitle)`
  text-align: right;
  font-size: var(--fs-heading-1);
  font-weight: 500;
  line-height: 1.2;
  color: var(--sea-ink);
`

const StyledDialogDescription = styled(DialogDescription)`
  direction: rtl;
  text-align: start;
  font-size: var(--fs-base);
  color: var(--text-color);
  font-weight: 400;
  line-height: 1.4;
`

const ScrollableContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 38px 16px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`

const DialogBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
`

const FieldLabel = styled.span`
  font-size: var(--fs-xl);
  font-weight: 400;
  color: var(--sea-ink);
  line-height: 1.4;
`

const EitherOrRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  direction: rtl;
`

const EmblemSection = styled.div`
  max-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
`

const OrSeparator = styled.span`
  font-size: var(--fs-base);
  color: rgba(0, 0, 0, 0.25);
  flex-shrink: 0;
  line-height: 24px;
`

const ColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

const ColorLabel = styled.span`
  font-size: var(--fs-base);
  color: var(--text-color);
  line-height: 22px;
  white-space: nowrap;
`

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`

const DialogHeader = styled.div<{ $shadow: boolean }>`
  flex-shrink: 0;
  padding-inline: 38px;
  position: relative;
  z-index: 1;
  clip-path: inset(0 0 -20px 0);
  transition: box-shadow 200ms ease;
  box-shadow: ${({ $shadow }) => ($shadow ? "0px 10px 20px 0px rgba(0, 0, 0, 0.06)" : "none")};
`

const DialogActions = styled.div<{ $shadow: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  clip-path: inset(-20px 0 0 0);
  transition: box-shadow 200ms ease;
  box-shadow: ${({ $shadow }) => ($shadow ? "0px -10px 20px 0px rgba(0, 0, 0, 0.06)" : "none")};
`
