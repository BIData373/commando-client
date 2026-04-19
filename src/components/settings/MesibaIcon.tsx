import styled from '@emotion/styled'
import type { IMesibaIcon } from '#/hooks/useMesiba'

interface MesibaIconProps {
    icon: IMesibaIcon
}

export function MesibaIcon({ icon }: MesibaIconProps) {
    return (
        <IconItemRow>
            <IconThumb src={icon.iconName} alt={icon.heb_name} />
            <IconLabel>{icon.heb_name}</IconLabel>
        </IconItemRow>
    )
}

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