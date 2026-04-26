import styled from '@emotion/styled'
import { X } from 'lucide-react'
import { Popover as PopoverPrimitive } from 'radix-ui'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { StatusTag, type DirectiveStatus } from './StatusCell'

export type AvatarColor = 'cyan' | 'blue' | 'green' | 'orange' | 'gray'

export interface Assignee {
  id: number
  initials: string
  colorToken: AvatarColor
  name: string
  role: string
  email: string
}

export interface RelatedDirective {
  user: Assignee
  status: DirectiveStatus
}

interface ResponsibleCellProps {
  responsible: Assignee | null
  relatedDirectives: RelatedDirective[]
}

export function ResponsibleCell({ responsible, relatedDirectives }: ResponsibleCellProps) {
  return (
    <CellRoot>
      {responsible && (
        <Popover>
          <PopoverTrigger asChild>
            <AvatarCircle $color={responsible.colorToken}>
              {responsible.initials}
            </AvatarCircle>
          </PopoverTrigger>
          <DetailedContent side="top" sideOffset={10} align="center">
            <PopoverArrow width={12} height={6} />
            <CloseButton>
              <X size={14} />
            </CloseButton>
            <DetailedHeader>
              <SectionLabel>אחראי :</SectionLabel>
              <AvatarCircle $color={responsible.colorToken}>
                {responsible.initials}
              </AvatarCircle>
              <RoleText>{responsible.role}</RoleText>
            </DetailedHeader>
            <Separator />
            {relatedDirectives.length > 0 && (
              <>
                <Separator />
                <SectionLabel>משתמשים מכותבים :</SectionLabel>
                <UserScrollArea>
                  <UserList>
                    {relatedDirectives.map((d) => (
                      <UserRow key={d.user.id}>
                        <UserInfo>
                          <UserName>{d.user.name}</UserName>
                          <UserEmail>{d.user.email}</UserEmail>
                        </UserInfo>
                      </UserRow>
                    ))}
                  </UserList>
                </UserScrollArea>
              </>
            )}
          </DetailedContent>
        </Popover>
      )}
      {relatedDirectives.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <AvatarCircle $color={'gray'}>
              {relatedDirectives.length}+
            </AvatarCircle>
          </PopoverTrigger>
          <CompactContent side="top" sideOffset={10} align="center">
            <PopoverArrow width={12} height={6} />
            <CompactList>
              {relatedDirectives.map((d) => (
                <CompactRow key={d.user.id}>
                  <StatusTag status={d.status} />
                  <CompactRole>{d.user.role}</CompactRole>
                  <AvatarCircle $color={d.user.colorToken}>
                    {d.user.initials}
                  </AvatarCircle>
                </CompactRow>
              ))}
            </CompactList>
          </CompactContent>
        </Popover>
      )}
    </CellRoot>
  )
}

// ─── Cell layout ──────────────────────────────────────────────────────────────

const CellRoot = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

// ─── Avatar ───────────────────────────────────────────────────────────────────

const AvatarCircle = styled.button<{ $color: AvatarColor }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 29px;
  height: 29px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: var(--sea-ink);
  flex-shrink: 0;
  cursor: pointer;
  border: none;
  padding: 0;
  ${({ $color }) => {
    switch ($color) {
      case 'cyan': return 'background: #87e8de;'
      case 'blue': return 'background: #91caff;'
      case 'green': return 'background: #b7eb8f;'
      case 'orange': return 'background: #ffd591;'
      case 'gray': return 'background: #F5F5F5;'
    }
  }}
`

// ─── Shared popover styles ─────────────────────────────────────────────────────

const POPOVER_SHADOW = `
  box-shadow:
    0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px rgba(0, 0, 0, 0.12),
    0px 9px 28px rgba(0, 0, 0, 0.05);
`

const PopoverArrow = styled(PopoverPrimitive.Arrow)`
  fill: white;
`

// ─── Detailed popover ─────────────────────────────────────────────────────────

const DetailedContent = styled(PopoverContent)`
  position: relative;
  width: 260px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${POPOVER_SHADOW}
`

const CloseButton = styled(PopoverPrimitive.Close)`
  position: absolute;
  inset-block-start: 8px;
  inset-inline-end: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: var(--sea-ink-soft);
  cursor: pointer;

  &:hover {
    background: var(--link-bg-hover);
    color: var(--sea-ink);
  }
`

const DetailedHeader = styled.div`
direction: rtl;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-inline-end: 24px;
`

const RoleText = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: var(--sea-ink);
`

const Separator = styled.div`
  height: 0.5px;
  background: var(--line);
`

const SectionLabel = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: var(--Colors-Base-Neutral-7, #8C8C8C);
`

const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

const UserName = styled.span`
  font-size: 14px;
  color: var(--sea-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const UserEmail = styled.span`
  font-size: 12px;
  color: var(--sea-ink-soft);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const UserScrollArea = styled.div`
  overflow-y: auto;
  max-height: 110px;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.06);

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.06);
    border-radius: 51px;
    }
    
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 31px;
    }
    
`

const UserList = styled.div`
  direction: rtl;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-inline-end: 8px;
`

// ─── Compact popover ──────────────────────────────────────────────────────────

const CompactContent = styled(PopoverContent)`
  width: auto;
  min-width: 200px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0;
  ${POPOVER_SHADOW}
`

const CompactList = styled.div`
  direction: ltr;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const CompactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const CompactRole = styled.span`
  font-size: 14px;
  color: var(--sea-ink);
  flex: 1;
  white-space: nowrap;
`
