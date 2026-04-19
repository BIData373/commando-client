import styled from '@emotion/styled'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DropdownIcons } from '#/components/settings/DropdownIcons'
import { SelectCommand } from '#/components/settings/SelectCommand'
import { Input } from '../../../../components/ui/input'
import type { IMesibaIcon } from '../../../../hooks/useMesiba'
import { useUpdateWorkspaceSettings, useWorkspaceSettings } from '../../../../hooks/useWorkspaceSettings'

export const Route = createFileRoute('/workspace/$urlName/settings/general')({ component: SettingsGeneral })

const NAME_MAX_LENGTH = 50

interface FormState {
  name: string
  command: string
  emblem: string
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
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) {
    setField('name', e.target.value.slice(0, NAME_MAX_LENGTH))
  }

  function handleCommandChange(value: string) {
    setField('command', value)
  }

  function handleEmblemClear() {
    setField('emblem', '')
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
        <SelectCommand
          command={form.command}
          onChange={handleCommandChange}
        />
      </FieldRow>

      <FieldRow>
        <FieldLabel>סמל</FieldLabel>
        <DropdownIcons
          onSelect={handleIconSelect}
          onClearEmblem={handleEmblemClear}
          emblemSrc={form.emblem}
        />
      </FieldRow>
    </FormRoot >
  )
}

const FormRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 400px;
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