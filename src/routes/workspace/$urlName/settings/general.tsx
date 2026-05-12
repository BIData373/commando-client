import styled from '@emotion/styled'
import { createFileRoute } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useState } from 'react'
import { IconDropdown } from '#/components/settings/IconDropdown'
import { SectionTitle } from '#/components/settings/SectionTitle'
import { SelectCommand } from '#/components/settings/SelectCommand'
import type { IMesibaIcon } from '#/hooks/useMesiba'
import { SETTINGS_TABS, SettingTabPath } from '#/utils/settingsUtils'
import { Input } from '../../../../components/ui/input'
import { useUpdateWorkspaceSettings, useWorkspaceSettings } from '../../../../hooks/useWorkspaceSettings'
import { useWorkspace } from '#/providers/WorkspaceProvider'

export const Route = createFileRoute('/workspace/$urlName/settings/general')({ component: SettingsGeneral })

const NAME_MAX_LENGTH = 50
const activeTabLabel = SETTINGS_TABS[SettingTabPath.GENERAL]

interface FormState {
  name: string
  command: string
  emblem: string
}

function SettingsGeneral() {
  const workspace = useWorkspace()

  const { data: settings } = useWorkspaceSettings(workspace.urlName)
  const { mutate: updateSettings } = useUpdateWorkspaceSettings(workspace.urlName)


  const [form, setForm] = useState<FormState>({
    name: workspace.title ?? '',
    command: workspace.pikudId.toString() ?? '',
    emblem: workspace.icon ?? '',
  })
  const [iconSearch, setIconSearch] = useState('')
  const [selectedIcon, setSelectedIcon] = useState<IMesibaIcon | null>(null)

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    const next = { ...form, [key]: value }
    setForm(next)
    updateSettings({
      name: next.name,
      command: next.command || null,
      logoUrl: next.emblem || null,
    })
  }

  function handleIconSelect(icon: IMesibaIcon) {
    setField('emblem', icon.iconName)
    setSelectedIcon(icon)
    setIconSearch('')
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) {
    setField('name', e.target.value.slice(0, NAME_MAX_LENGTH))
  }

  function handleCommandChange(value: string) {
    setField('command', value)
  }

  function handleIconClear() {
    setField('emblem', '')
    setSelectedIcon(null)
    setIconSearch('')
  }

  function handleImageNotFound(e: React.SyntheticEvent<HTMLImageElement>) {
    e.currentTarget.onerror = null
    e.currentTarget.src = '/workspace-icon.png'
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
                value={form.name}
                onChange={handleNameChange}
                placeholder="הזן שם סביבה"
                maxLength={NAME_MAX_LENGTH}
              />
              <CharCounter $atLimit={form.name.length >= NAME_MAX_LENGTH}>
                {form.name.length}/{NAME_MAX_LENGTH}
              </CharCounter>
            </InputWrapper>
          </FieldRow>

          <FieldRow>
            <FieldLabel>שיוך פיקודי ארגוני</FieldLabel>
            <SelectCommand
              command={form.command}
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
            <EmblemPreview>
              {form.emblem ? (
                <>
                  <EmblemClearButton type="button" onClick={handleIconClear}>
                    <X size={16} />
                  </EmblemClearButton>
                  <img
                    src={form.emblem}
                    alt="סמל לשכה"
                    onError={handleImageNotFound}
                  />
                </>
              ) : (
                <EmblemPlaceholder>בחר סמל</EmblemPlaceholder>
              )}
            </EmblemPreview>
          </FieldRow>
        </FormRoot>
      </GeneralScrollArea>
    </GeneralRootPage>
  )
}

const GeneralRootPage = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
`

const GeneralScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  direction: ltr;
  padding: 0 12px;
`

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
  color: ${({ $atLimit }) => ($atLimit ? 'var(--color-danger, #e53e3e)' : 'var(--sea-ink-soft)')};
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

export const EmblemPreview = styled.div`
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

export const EmblemPlaceholder = styled.span`
  font-size: 13px;
  color: var(--sea-ink-soft);
`

export const EmblemClearButton = styled.button`
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