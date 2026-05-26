import styled from "@emotion/styled";
import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useState } from "react";
import { useListPikuds } from "src/api/pikud/pikud";
import { useListWorkspaces, useUpdateWorkspace } from "src/api/workspace/workspace";
import { IconDropdown } from "src/components/settings/IconDropdown";
import { SectionTitle } from "src/components/settings/SectionTitle";
import { SelectCommand } from "src/components/settings/SelectCommand";
import type { IMesibaIcon } from "src/hooks/useMesiba";
import { SETTINGS_TABS, SettingTabPath } from "src/utils/settingsUtils";
import { Input } from "../../../../components/ui/input";

export const Route = createFileRoute("/workspace/$urlName/settings/general")({
	component: SettingsGeneral,
});

const NAME_MAX_LENGTH = 50;
const activeTabLabel = SETTINGS_TABS[SettingTabPath.GENERAL];

interface FormState {
	title: string;
	// pikud: string;
	icon: string;
}

function SettingsGeneral() {
	const { urlName } = Route.useParams();

	const { data: pikuds } = useListPikuds()
	const { data: workspaces } = useListWorkspaces({ urlName });
	const { mutate: updateSettings } = useUpdateWorkspace();

	const settings = workspaces?.[0]

	const [form, setForm] = useState<FormState>({
		title: settings?.title ?? "",
		// pikudId: settings?.pikudId ?? "",
		icon: settings?.icon ?? "",
	});
	const [iconSearch, setIconSearch] = useState("");
	const [selectedIcon, setSelectedIcon] = useState<IMesibaIcon | null>(null);

	const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
		const next = { ...form, [key]: value };
		setForm(next);
		updateSettings({
			pathParams: { id: settings?.id },
			data: {
				title: next.title,
				// pikudId: next.pikud,
				icon: next.icon,
			}
		});
	};

	function handleIconSelect(icon: IMesibaIcon) {
		setField("icon", icon.iconName);
		setSelectedIcon(icon);
		setIconSearch("");
	}

	function handleNameChange(
		e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
	) {
		setField("title", e.target.value.slice(0, NAME_MAX_LENGTH));
	}

	function handleCommandChange(value: string) {
		setField("pikud", value);
	}

	function handleIconClear() {
		setField("icon", "");
		setSelectedIcon(null);
		setIconSearch("");
	}

	function handleImageNotFound(e: React.SyntheticEvent<HTMLImageElement>) {
		e.currentTarget.onerror = null;
		e.currentTarget.src = "/workspace-icon.png";
	}

	return (
		<GeneralRootPage>
			<SectionTitle title={activeTabLabel} />
			<GeneralScrollArea>
				<FormRoot>
					<FieldRow>
						<FieldLabel>שם סביבה</FieldLabel>
						<InputWrapper>
							<StyledInput
								value={form.title}
								onChange={handleNameChange}
								placeholder="הזן שם סביבה"
								maxLength={NAME_MAX_LENGTH}
							/>
							<CharCounter $atLimit={form.title.length >= NAME_MAX_LENGTH}>
								{form.title.length}/{NAME_MAX_LENGTH}
							</CharCounter>
						</InputWrapper>
					</FieldRow>

					<FieldRow>
						<FieldLabel>שיוך פיקודי ארגוני</FieldLabel>
						<SelectCommand
							command={form.pikudId}
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
						<iconPreview>
							{form.icon ? (
								<>
									<iconClearButton type="button" onClick={handleIconClear}>
										<X size={16} />
									</iconClearButton>
									<img
										src={form.icon}
										alt="סמל לשכה"
										onError={handleImageNotFound}
									/>
								</>
							) : (
								<iconPlaceholder>בחר סמל</iconPlaceholder>
							)}
						</iconPreview>
					</FieldRow>
				</FormRoot>
			</GeneralScrollArea>
		</GeneralRootPage>
	);
}

const GeneralRootPage = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
`;

const GeneralScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  direction: ltr;
  padding: 0 12px;
`;

const FormRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 400px;
  direction: rtl;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StyledInput = styled(Input)`
  background: var(--background);
`;

const CharCounter = styled.span<{ $atLimit: boolean }>`
  font-size: 12px;
  color: ${({ $atLimit }) => ($atLimit ? "var(--color-danger, #e53e3e)" : "var(--sea-ink-soft)")};
  text-align: end;
`;

const FieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FieldLabel = styled.label`
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
`;

export const iconPreview = styled.div`
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
`;

export const iconPlaceholder = styled.span`
  font-size: 13px;
  color: var(--sea-ink-soft);
`;

export const iconClearButton = styled.button`
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
`;
