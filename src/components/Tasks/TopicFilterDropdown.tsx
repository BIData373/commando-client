import { useState } from 'react'
import styled from '@emotion/styled'
import { ChevronDown } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Checkbox } from '../ui/checkbox'

interface TopicFilterDropdownProps {
  topics: string[]
  activeTopics: Set<string>
  onApply: (selected: Set<string>) => void
  $active: boolean
}

function TopicFilterDropdown({ topics, activeTopics, onApply, $active }: TopicFilterDropdownProps) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState<Set<string>>(new Set(activeTopics))

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setPending(new Set(activeTopics))
    }
    setOpen(nextOpen)
  }

  function toggleTopic(topic: string) {
    setPending((prev) => {
      const next = new Set(prev)
      if (next.has(topic)) {
        next.delete(topic)
      } else {
        next.add(topic)
      }
      return next
    })
  }

  function handleApply() {
    onApply(pending)
    setOpen(false)
  }

  function handleReset() {
    onApply(new Set())
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <TriggerPill $active={$active}>
          <ChevronDown size={16} />
          נושא
        </TriggerPill>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={8} asChild>
        <DropdownPanel>
          <ItemList>
            {topics.map((topic) => (
              <DropdownItem
                key={topic}
                $selected={pending.has(topic)}
                onClick={() => toggleTopic(topic)}
              >
                <TopicLabel>{topic}</TopicLabel>
                <Checkbox checked={pending.has(topic)} />
              </DropdownItem>
            ))}
          </ItemList>
          <Divider />
          <FooterRow>
            <ResetButton onClick={handleReset}>
              אפס
            </ResetButton>
            <ApplyButton onClick={handleApply} disabled={pending.size === 0}>
              החל ({pending.size})
            </ApplyButton>
          </FooterRow>
        </DropdownPanel>
      </PopoverContent>
    </Popover>
  )
}

export { TopicFilterDropdown }

// ─── Styled ──────────────────────────────────────────────────────────────────

const TriggerPill = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding-inline: 12px;
  height: 32px;
  border-radius: 999px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(9, 88, 217, 0.6)' : '#D9D9D9')};
  background: #FFF;
  color: ${({ $active }) => ($active ? 'rgba(9, 88, 217, 1)' : 'var(--sea-ink)')};

  &:hover {
    background: var(--link-bg-hover);
  }
`

const DropdownPanel = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px;
  border-radius: 8px;
  background: white;
  box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.08),
    0px 3px 6px 0px rgba(0, 0, 0, 0.12),
    0px 9px 28px 0px rgba(0, 0, 0, 0.05);
  width: auto;
  min-width: 180px;
`

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 160px;
  overflow-y: auto;
`

const DropdownItem = styled.div<{ $selected: boolean }>`
  direction: ltr;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  height: 32px;
  padding: 5px 12px;
  cursor: pointer;
  background: ${({ $selected }) => ($selected ? 'rgba(0, 0, 0, 0.04)' : 'transparent')};

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`

const TopicLabel = styled.span`
  flex: 1;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  text-align: end;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Divider = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin-block: 4px;
`

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ApplyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding-inline: 7px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: white;
  cursor: pointer;
  background: linear-gradient(158deg, #6866ff 0%, #7604c8 100%);
  box-shadow: 0px 2px 0px 0px rgba(5, 145, 255, 0.1);

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding-inline: 7px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  cursor: pointer;
  background: transparent;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`
