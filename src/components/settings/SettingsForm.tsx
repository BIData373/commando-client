import styled from "@emotion/styled"
import { useForm } from "@tanstack/react-form"
import { useStore } from "@tanstack/react-store"
import { debounce } from "lodash"
import { X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import type { UpdateWorkspaceDto } from "src/api/model"
import { getListPersonalTaskRowsQueryKey } from "src/api/task/task"
import {
	getGetPermittedWorkspacesQueryKey,
	getListWorkspacesQueryKey,
	useUpdateWorkspace,
} from "src/api/workspace/workspace"
import type { IMesibaIcon } from "src/hooks/useMesiba"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { invalidateQueries } from "src/queryClient"
import { isWorkspaceExist } from "src/utils/error-utils"
import { formatMesibaIcon } from "src/utils/icon-utils"
import { DATA_COUNTER_CLASS, NAME_MAX_LENGTH } from "src/utils/workspace-utils"
import { FormField } from "../shared/FormField"
import { Input } from "../ui/input"
import { IconDropdown } from "./IconDropdown"
import { SelectCommand } from "./SelectCommand"

const DEBOUNCE_MS = 300

export function SettingsForm() {
	const {
		workspace: { id, title, pikudId, icon },
		setWorkspace,
	} = useWorkspace()

	const { mutateAsync: updateSettings } = useUpdateWorkspace({
		mutation: {
			onSuccess(data) {
				invalidateQueries([
					getListWorkspacesQueryKey(),
					getGetPermittedWorkspacesQueryKey(),
					getListPersonalTaskRowsQueryKey(),
				])
				setWorkspace(data)
			},
		},
	})

	const [iconSearch, setIconSearch] = useState("")

	const form = useForm({
		defaultValues: { title, pikudId, icon } as UpdateWorkspaceDto,
		asyncDebounceMs: DEBOUNCE_MS,
		onSubmit: async ({ value, formApi }) => {
			updateSettings(
				{
					pathParams: { id },
					data: value,
				},
				{
					onError: (error) => {
						if (isWorkspaceExist(error)) {
							toast.error("שם סביבה זה כבר קיים, אנא נסו שוב", {
								closeButton: true,
							})
						}

						formApi.reset()
					},
				},
			)
		},
	})

	const values = useStore(form.store, (state) => state.values)
	const debouncedSubmit = useMemo(
		() => debounce(() => form.handleSubmit(), DEBOUNCE_MS),
		[form],
	)
	const mounted = useRef(false)

	useEffect(() => {
		if (!mounted.current) {
			mounted.current = true
			return
		}
		debouncedSubmit()
	}, [values, debouncedSubmit])

	function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const next = e.target.value.slice(0, NAME_MAX_LENGTH)
		if (!next.trim()) {
			toast.error("שם סביבה הוא שדה חובה", {
				closeButton: true,
			})
			return
		}

		form.setFieldValue("title", next)
	}

	function handlePikudChange(value: number) {
		form.setFieldValue("pikudId", value)
	}

	function handleIconSelect(icon: IMesibaIcon) {
		form.setFieldValue("icon", icon.iconName)
		setIconSearch(icon.heb_name)
	}

	function handleIconSearchClear() {
		setIconSearch("")
	}

	function handleIconClear() {
		form.setFieldValue("icon", "")
	}

	function handleImageNotFound(e: React.SyntheticEvent<HTMLImageElement>) {
		e.currentTarget.onerror = null
		e.currentTarget.src = "/workspace-icon.png"
	}

	return (
		<FormRoot>
			<FormField label="שם סביבה">
				<InputWrapper>
					<StyledInput
						value={values.title ?? ""}
						onChange={handleTitleChange}
						placeholder="הזן שם סביבה"
						maxLength={NAME_MAX_LENGTH}
					/>
					<CharCounter
						$atLimit={(values.title ?? "").length >= NAME_MAX_LENGTH}
						className={DATA_COUNTER_CLASS}
					>
						{(values.title ?? "").length}/{NAME_MAX_LENGTH}
					</CharCounter>
				</InputWrapper>
			</FormField>

			<FormField label="שיוך פיקודי ארגוני">
				<SelectCommand
					value={values.pikudId ?? pikudId}
					onChange={handlePikudChange}
				/>
			</FormField>

			<FormField label="סמל">
				<IconDropdown
					value={iconSearch}
					onChange={setIconSearch}
					onClear={handleIconSearchClear}
					onSelect={handleIconSelect}
				/>
				<IconPreview>
					{values.icon ? (
						<>
							<IconClearButton type="button" onClick={handleIconClear}>
								<X size={16} />
							</IconClearButton>
							<IconImg
								src={formatMesibaIcon(values.icon)}
								alt="סמל לשכה"
								onError={handleImageNotFound}
							/>
						</>
					) : (
						<IconPlaceholder>בחר סמל</IconPlaceholder>
					)}
				</IconPreview>
			</FormField>
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

const CharCounter = styled.span<{ $atLimit: boolean }>`
  font-size: var(--fs-sm);
  color: ${({ $atLimit }) => ($atLimit ? "var(--color-danger)" : "var(--sea-ink-soft)")};
  text-align: end;
  opacity: 0;
  transition: opacity 0.15s;
`

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;

  &:hover .${DATA_COUNTER_CLASS},
  &:focus-within .${DATA_COUNTER_CLASS} {
	opacity: 1;
  }


`

const StyledInput = styled(Input)`
  background: var(--background);
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
  width: 100%;
`

const IconImg = styled.img`
  width: 100px;
  object-fit: contain;
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
