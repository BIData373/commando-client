import styled from '@emotion/styled'
import { createFileRoute } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useState } from 'react'
import { SearchDropdown } from '../../../../components/settings/SearchDropdown'
import { Input } from '../../../../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import type { IMesibaIcon } from '../../../../hooks/useMesiba'
import { useSearchMesibaIcons } from '../../../../hooks/useMesiba'
import { useUpdateWorkspaceSettings, useWorkspaceSettings } from '../../../../hooks/useWorkspaceSettings'

export const Route = createFileRoute('/workspace/$urlName/settings/general')({ component: SettingsGeneral })

const NAME_MAX_LENGTH = 50

const COMMAND_OPTIONS = [
  'פיקוד צפון',
  'פיקוד מרכז',
  'פיקוד דרום',
  'פיקוד העורף',
  'פיקוד העומק',
  'מטכ״ל',
] as const

interface FormState {
  name: string
  command: string
  emblem: string
}

function renderIconItem(icon: IMesibaIcon) {
  return (
    <IconItemRow>
      <IconThumb src={icon.iconName} alt={icon.heb_name} />
      <IconLabel>{icon.heb_name}</IconLabel>
    </IconItemRow>
  )
}

function SettingsGeneral() {
  const { urlName } = Route.useParams()
  const { data: settings } = useWorkspaceSettings(urlName)
  const { mutate: updateSettings } = useUpdateWorkspaceSettings(urlName)

  const [form, setForm] = useState<FormState>({
    name: settings?.name ?? '',
    command: settings?.command ?? '',
    emblem: settings?.logoUrl ?? '',
  })

  const [iconSearch, setIconSearch] = useState('')
  const { data: icons = [], isFetching } = useSearchMesibaIcons(iconSearch)

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    const next = { ...form, [key]: value }
    setForm(next)
    updateSettings({
      name: next.name,
      command: next.command || null,
      logoUrl: next.emblem || null,
    })
  }

  function handleClearEmblem() {
    setField('emblem', '')
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) {
    setField('name', e.target.value.slice(0, NAME_MAX_LENGTH))
  }

  function handleCommandChange(value: string) {
    setField('command', value)
  }

  function handleImageNotFound(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    e.currentTarget.onerror = null
    e.currentTarget.src = '/workspace-icon.png'
  }

  return (
    <FormRoot>
      <FieldRow>
        <FieldLabel>שם סביבה</FieldLabel>
        <InputWrapper>
          <Input
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
        <Select value={form.command} onValueChange={handleCommandChange}>
          <StyledSelectTrigger>
            <SelectValue placeholder="בחר פיקוד" />
          </StyledSelectTrigger>
          <StyledSelectContent position="popper" side="bottom">
            {COMMAND_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </StyledSelectContent>
        </Select>
      </FieldRow>

      <FieldRow>
        <FieldLabel>סמל</FieldLabel>
        <SearchDropdown<IMesibaIcon>
          items={icons}
          value={iconSearch}
          onChange={setIconSearch}
          onSelect={(icon) => { setField('emblem', icon.iconName); setIconSearch('') }}
          onClear={() => setIconSearch('')}
          isLoading={isFetching}
          placeholder="חפש סמל"
          renderItem={renderIconItem}
        />
        <EmblemPreview>
          <EmblemClearButton type="button" onClick={handleClearEmblem}>
            <X size={16} />
          </EmblemClearButton>
          {form.emblem ? (
            <img
              src={form.emblem}
              alt='סמל לשכה'
              onError={handleImageNotFound}
            />
          ) : (
            <EmblemPlaceholder>בחר סמל</EmblemPlaceholder>
          )}
        </EmblemPreview>
      </FieldRow>
    </FormRoot>
  )
}



const FormRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 400px;
`

const FieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const FieldLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--sea-ink);
`

const EmblemPreview = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px dashed var(--card-border);
  border-radius: 8px;
  padding: 16px;
  height: 166px;

  img {
    width: 48px;
    height: 48px;
    object-fit: contain;
    border-radius: 50%;
  }
`

const EmblemPlaceholder = styled.span`
  font-size: 13px;
  color: var(--sea-ink-soft);
`

const EmblemClearButton = styled.button`
  position: absolute;
  inset-block-start: 8px;
  inset-inline-end: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: transparent;
  color: var(--sea-ink-soft);
  cursor: pointer;

  &:hover {
    background: var(--link-bg-hover);
    color: var(--sea-ink);
  }
`

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const CharCounter = styled.span<{ $atLimit: boolean }>`
  font-size: 12px;
  color: ${({ $atLimit }) => ($atLimit ? 'var(--color-danger, #e53e3e)' : 'var(--sea-ink-soft)')};
  text-align: end;
`

const StyledSelectTrigger = styled(SelectTrigger)`
  width: 100%;
  flex-direction: row-reverse;
`

const StyledSelectContent = styled(SelectContent)`
  & [data-slot="select-scroll-up-button"],
  & [data-slot="select-scroll-down-button"] {
    display: none;
  }
`

const IconItemRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`

const IconThumb = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 4px;
  flex-shrink: 0;
`

const IconLabel = styled.span`
  font-size: 14px;
  color: var(--sea-ink);
`
