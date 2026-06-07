import styled from "@emotion/styled"
import { debounce } from "lodash"
import { X } from "lucide-react"
import { useMemo, useState } from "react"
import type { UpdateWorkspaceDto } from "src/api/model"
import {
	getListWorkspacesQueryKey,
	useUpdateWorkspace,
} from "src/api/workspace/workspace"
import type { IMesibaIcon } from "src/hooks/useMesiba"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { queryClient } from "src/queryClient"
import { Input } from "../ui/input"
import { IconDropdown } from "./IconDropdown"
import { SelectCommand } from "./SelectCommand"

const NAME_MAX_LENGTH = 50
const DEBOUNCE_MS = 300

export function SettingsForm() {
	const {
		workspace: { id, title, pikudId, icon },
		setWorkspace,
	} = useWorkspace()
	const { mutate: updateSettings, isSuccess } = useUpdateWorkspace({
		mutation: {
			onSuccess() {
				queryClient.invalidateQueries({
					queryKey: getListWorkspacesQueryKey(),
				})
			},
		},
	})

	const [form, setForm] = useState<UpdateWorkspaceDto>({ title, pikudId, icon })
	const [prevName, setPrevName] = useState(title)
	const [iconSearch, setIconSearch] = useState("")
	const [selectedIcon, setSelectedIcon] = useState<IMesibaIcon | null>(null)

	const updateSettingsDebounced = useMemo(
		() => debounce(updateSettings, DEBOUNCE_MS),
		[updateSettings],
	)

	const setField = <K extends keyof UpdateWorkspaceDto>(
		key: K,
		value: UpdateWorkspaceDto[K],
	) => {
		const next = { ...form, [key]: value }
		setForm(next)
		updateSettingsDebounced(
			{
				pathParams: { id },
				data: next,
			},
			{
				onSuccess(data) {
					setWorkspace(data)
				},
				onError() {
					setForm({ ...form, [key]: prevName })
				},
			},
		)
	}

	function handleIconSelect(icon: IMesibaIcon) {
		setField("icon", icon.iconName)
		setSelectedIcon(icon)
		setIconSearch("")
	}

	function handleNameChange(
		e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
	) {
		const title = e.target.value.slice(0, NAME_MAX_LENGTH)
		if (isSuccess) {
			setPrevName(title)
		}
		setField("title", title)
	}

	function handleCommandChange(value: number) {
		setField("pikudId", value)
	}

	function handleIconClear() {
		setField("icon", "")
		setSelectedIcon(null)
		setIconSearch("")
	}

	function handleImageNotFound(e: React.SyntheticEvent<HTMLImageElement>) {
		e.currentTarget.onerror = null
		e.currentTarget.src = "/workspace-icon.png"
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.code === "Space" || e.key === " ") {
			e.preventDefault()
			return
		}

		if (e.key === "Backspace" && e.currentTarget.value.length === 1) {
			e.preventDefault()
		}
	}

	return (
		<FormRoot>
			<FieldRow>
				<FieldLabel>שם סביבה</FieldLabel>
				<InputWrapper>
					<StyledInput
						value={form.title}
						onKeyDown={handleKeyDown}
						onChange={handleNameChange}
						placeholder="הזן שם סביבה"
						maxLength={NAME_MAX_LENGTH}
					/>
					<CharCounter
						$atLimit={!!form.title && form.title.length >= NAME_MAX_LENGTH}
					>
						{form?.title?.length ?? 0}/{NAME_MAX_LENGTH}
					</CharCounter>
				</InputWrapper>
			</FieldRow>

			<FieldRow>
				<FieldLabel>שיוך פיקודי ארגוני</FieldLabel>
				<SelectCommand
					value={form.pikudId ?? pikudId}
					onChange={handleCommandChange}
				/>
			</FieldRow>

			<FieldRow>
				<FieldLabel>סמל</FieldLabel>
				<IconDropdown
					value={iconSearch}
					onChange={setIconSearch}
					onClear={handleIconClear}
					onSelect={handleIconSelect}
					selectedItem={selectedIcon ?? undefined}
				/>
				<IconPreview>
					{form.icon ? (
						<>
							<IconClearButton type="button" onClick={handleIconClear}>
								<X size={16} />
							</IconClearButton>
							<img
								src={form.icon}
								alt="סמל לשכה"
								onError={handleImageNotFound}
							/>
						</>
					) : (
						<IconPlaceholder>בחר סמל</IconPlaceholder>
					)}
				</IconPreview>
			</FieldRow>
		</FormRoot>
	)
}

const FormRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 400px;
  direction: rtl;
`

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const StyledInput = styled(Input)`
  background: var(--background);
`

const CharCounter = styled.span<{ $atLimit: boolean }>`
  font-size: 12px;
  color: ${({ $atLimit }) => ($atLimit ? "var(--color-danger, #e53e3e)" : "var(--sea-ink-soft)")};
  text-align: end;
`

const FieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const FieldLabel = styled.label`
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
`

const IconPreview = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px dashed var(--card-border);
  border-radius: 6px;
  padding: 16px;
  height: 166px;

  img {
    width: 48px;
    height: 48px;
    object-fit: contain;
    border-radius: 50%;
  }
`

const IconPlaceholder = styled.span`
  font-size: 13px;
  color: var(--sea-ink-soft);
`

const IconClearButton = styled.button`
  position: absolute;
  inset-block-start: 8px;
  inset-inline-end: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: transparent;
  color: var(--sea-ink-soft);
  cursor: pointer;

  &:hover {
    background: var(--link-bg-hover);
    color: var(--sea-ink);
  }
`
