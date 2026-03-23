import styled from '@emotion/styled'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { Input } from '../../../../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'

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

function SettingsGeneral() {
  const form = useForm({
    defaultValues: {
      name: '',
      command: '',
      emblem: '',
    },
    onSubmit: async () => {
      // TODO: submit to API
    },
  })

  function handleClearEmblem() {
    form.setFieldValue('emblem', '')
  }

  return (
    <FormRoot>
      <form.Field name="name">
        {(field) => (
          <FieldRow>
            <FieldLabel htmlFor={field.name}>שם סביבה</FieldLabel>
            <InputWrapper>
              <Input
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value.slice(0, NAME_MAX_LENGTH))}
                placeholder="הזן שם סביבה"
                maxLength={NAME_MAX_LENGTH}
              />
              <CharCounter $atLimit={field.state.value.length >= NAME_MAX_LENGTH}>
                {field.state.value.length}/{NAME_MAX_LENGTH}
              </CharCounter>
            </InputWrapper>
          </FieldRow>
        )}
      </form.Field>

      <form.Field name="command">
        {(field) => (
          <FieldRow>
            <FieldLabel>שיוך פיקודי ארגוני</FieldLabel>
            <Select value={field.state.value} onValueChange={field.handleChange}>
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
        )}
      </form.Field>

      <form.Field name="emblem">
        {(field) => (
          <FieldRow>
            <FieldLabel htmlFor={field.name}>סמל</FieldLabel>
            <Input
              id={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="חפש סמל"
            />
            <EmblemPreview>
              <EmblemClearButton type="button" onClick={handleClearEmblem}>
                <X size={16} />
              </EmblemClearButton>
              {/* TODO: Mesiba api icon */}
              <img src={'kk'} alt='סמל לשכה' onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = "/workspace-icon.png"
              }} />
            </EmblemPreview>
          </FieldRow>
        )}
      </form.Field>
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

  border: 1px dashed black;
  border-radius: 8px;
  padding: 16px;
  height: 96px;

  img {
    width: 48px;
    height: 48px;
    object-fit: contain;
    border-radius: 50%;
  }
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