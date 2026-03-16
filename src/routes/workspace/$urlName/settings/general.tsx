import styled from '@emotion/styled'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { Input } from '../../../../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'

export const Route = createFileRoute('/workspace/$urlName/settings/general')({ component: SettingsGeneral })

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

  return (
    <FormRoot>
      <form.Field name="name">
        {(field) => (
          <FieldRow>
            <FieldLabel htmlFor={field.name}>שם הלשכה</FieldLabel>
            <Input
              id={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="הזן שם לשכה"
            />
          </FieldRow>
        )}
      </form.Field>

      <form.Field name="command">
        {(field) => (
          <FieldRow>
            <FieldLabel>שיוך פיקודי ארגוני</FieldLabel>
            <Select value={field.state.value} onValueChange={field.handleChange}>
              <SelectTrigger>
                <SelectValue placeholder="בחר פיקוד" />
              </SelectTrigger>
              <SelectContent>
                {COMMAND_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
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
              <img src="/workspace-icon.png" alt="סמל לשכה" />
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
  width: 480px;
  max-width: 100%;
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
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--line);
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
