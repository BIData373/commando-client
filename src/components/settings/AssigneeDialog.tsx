import styled from "@emotion/styled"
import { useForm } from "@tanstack/react-form"
import { Pencil } from "lucide-react"
import { useMemo, useState } from "react"
import {
	getGetAssigneeQueryKey,
	getListAssigneesQueryKey,
	useCreateAssignee,
	useUpdateAssignee,
} from "src/api/assignee/assignee"
import type {
	AssigneeDto,
	AssigneesDto,
	AssigneeUserDto,
	MirageUserDto,
} from "src/api/model"
import {
	getListPersonalTaskRowsQueryKey,
	getListTaskRowsQueryKey,
} from "src/api/task/task"
import {
	getUserStatusEditableDisabledReason,
	WORKSPACE_STATUS_EDITABLE_DISABLED,
} from "src/functions/status-editable-messages"
import {
	addResponsibleMessage,
	updateResponsibleMessage,
} from "src/functions/toast-messages"
import type { IMesibaIcon } from "src/hooks/useMesiba"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { invalidateQueries, queryClient } from "src/query-client"
import { CancelButton } from "../shared/CancelButton"
import { FormField } from "../shared/FormField"
import InputWithCount from "../shared/InputWithCount"
import { ModalContent } from "../shared/ModalContent"
import { PrimaryButton } from "../shared/PrimaryButton"
import { SettingToggleRow } from "../shared/SettingToggleRow"
import {
	Dialog,
	DialogClose,
	DialogDescription,
	DialogTitle,
} from "../ui/dialog"
import { type AssigneeFormUser, AssigneeUsersList } from "./AssigneeUsersList"
import { ColorPicker, PRESET_COLORS } from "./ColorPicker"
import { DropdownUsers } from "./DropdownUsers"
import { IconDropdown } from "./IconDropdown"

const MAX_NAME_LENGTH = 30

function toFormUsers(users: AssigneeUserDto[] = []): AssigneeFormUser[] {
	return users.map(({ user: { upn, info }, statusEditable }) => ({
		upn,
		info,
		statusEditable,
	}))
}

interface AssigneeDialogProps {
	open: boolean
	workspaceId: number
	assignee?: AssigneeDto
	onOpenChange(open: boolean): void
	onCreate?(assignee: AssigneeDto): void
}

export function AssigneeDialog({
	assignee,
	workspaceId,
	open,
	onOpenChange,
	onCreate,
}: AssigneeDialogProps) {
	const isUpdate = !!assignee

	const {
		workspace: { assigneeStatusEditable },
	} = useWorkspace()

	const [searchValue, setSearchValue] = useState<string>("")
	const [iconSearch, setIconSearch] = useState("")

	const mesibaIcon = useMemo(
		() =>
			assignee?.icon && assignee?.iconName
				? {
						heb_name: assignee.iconName,
						iconName: assignee.icon,
						id: 1,
					}
				: null,
		[assignee],
	)

	const [selectedIcon, setSelectedIcon] = useState<IMesibaIcon | null>(
		mesibaIcon,
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
			getListPersonalTaskRowsQueryKey(),
			getListTaskRowsQueryKey({ workspaceId }),
			...(assignee ? [getGetAssigneeQueryKey({ id: assignee.id })] : []),
		])
	}

	const { mutateAsync: createAssignee } = useCreateAssignee({
		mutation: {
			meta: {
				toast: { success: addResponsibleMessage, error: true },
			},
			onSuccess: handleSubmitSuccess,
		},
	})
	const { mutateAsync: updateAssignee } = useUpdateAssignee({
		mutation: {
			meta: {
				toast: { success: updateResponsibleMessage, error: true },
			},
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
			statusEditable: assignee?.statusEditable ?? true,
			users: toFormUsers(assignee?.users),
		},
		onSubmit: async ({ value }) => {
			const payload = {
				name: value.name.trim(),
				color: value.color,
				icon: value.icon || null,
				iconName: selectedIcon?.heb_name ?? null,
				statusEditable: value.statusEditable,
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
					: [...prev, { ...user, statusEditable: false }],
			)
			setSearchValue("")
		}
	}

	function handleUserStatusEditableChange(upn: string, checked: boolean) {
		form.setFieldValue("users", (prev) =>
			prev.map((user) =>
				user.upn === upn ? { ...user, statusEditable: checked } : user,
			),
		)
	}

	function handleSearchClear() {
		setSearchValue("")
	}

	function handleAssigneeStatusEditableChange(checked: boolean) {
		form.setFieldValue("statusEditable", checked)
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
		form.setFieldValue("users", toFormUsers(assignee?.users))
		setIconSearch("")
		setSelectedIcon(null)
		form.reset()
	}

	function handleOpenChange(open: boolean) {
		resetForm()
		onOpenChange(open)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<AssigneeDialogContent closable={false}>
				<DialogTitleLarge>
					{isUpdate ? "עריכת אחראי" : "יצירת אחראי"}
				</DialogTitleLarge>
				<StyledDialogDescription>
					'אחראי' אליו ניתן לשייך הנחיות.
					<br />
					לכל אחראי ניתן לכתב מספר משתמשים, אשר יקבלו את ההנחיות לאזור האישי
					שלהם.
				</StyledDialogDescription>
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
									<InputWithCount
										text={field.state.value}
										onChange={field.handleChange}
										maxLength={MAX_NAME_LENGTH}
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
								<ColorLabel>סמל</ColorLabel>
								<IconDropdown
									value={iconSearch}
									onChange={setIconSearch}
									onSelect={handleIconSelect}
									onClear={handleIconClear}
									selectedItem={selectedIcon ?? undefined}
									placeholder="בחר סמל"
								/>
							</EmblemSection>
						</EitherOrRow>
					</FieldGroup>

					<form.Subscribe selector={(s) => s.values.statusEditable}>
						{(statusEditable) => (
							<StatusEditableGroup>
								<ToggleRowWrapper>
									<SettingToggleRow
										label="אפשר למכותבים לעדכן סטטוס"
										tooltip={
											<p>
												קובע אם משתמשים המכותבים לאחראי זה רשאים לעדכן סטטוס
												ב’איזור האישי’.
												<br />
												ניתן להגביל הרשאה זו לחלק מהמכותבים או לכולם.
											</p>
										}
										icon={<Pencil size={18} />}
										checked={assigneeStatusEditable && statusEditable}
										disabled={!assigneeStatusEditable}
										disabledTooltip={WORKSPACE_STATUS_EDITABLE_DISABLED}
										onCheckedChange={handleAssigneeStatusEditableChange}
									/>
								</ToggleRowWrapper>
								<StatusEditableDescription>
									חל על כל המכותבים, ניתן לכבות את האפשרות למכותבים מסוימים.
								</StatusEditableDescription>
							</StatusEditableGroup>
						)}
					</form.Subscribe>

					<form.Field name="users">
						{(field) => (
							<UsersFieldGroup>
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
								<form.Subscribe selector={(s) => s.values.statusEditable}>
									{(statusEditable) => (
										<AssigneeUsersList
											users={field.state.value}
											disabledReason={getUserStatusEditableDisabledReason(
												assigneeStatusEditable,
												statusEditable,
											)}
											onRemove={handleRemoveAssignee}
											onStatusEditableChange={handleUserStatusEditableChange}
										/>
									)}
								</form.Subscribe>
							</UsersFieldGroup>
						)}
					</form.Field>
				</DialogBody>

				<DialogActions>
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
  min-height: 740px;
  max-width: calc(100vw - 2rem);
  max-height: calc(100vh - 2rem);
  max-height: 70vh;
  overflow: hidden;
  direction: rtl;
  gap: 24px;
  padding: 32px 48px;

  > div:first-of-type {
    display: contents;
  }
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
  padding-top: 8px;
`

const DialogBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  gap: 16px;
  width: 100%;
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
`

const UsersFieldGroup = styled(FieldGroup)`
  flex: 1;
  min-height: 0;
`

const FieldLabel = styled.span`
  font-size: var(--fs-xl);
  font-weight: 400;
  color: var(--text-color-2);
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
  width: 225px;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  > :last-child {
    flex: 1;
    min-width: 0;
  }
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

const StatusEditableGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const ToggleRowWrapper = styled.div`
  width: fit-content;
`

const StatusEditableDescription = styled.span`
  font-size: var(--fs-btn);
  line-height: 22px;
  color: var(--text-color-400);
`

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`

const DialogActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  clip-path: inset(-20px 0 0 0);
  transition: box-shadow 200ms ease;
`
