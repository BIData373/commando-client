import styled from "@emotion/styled"
import type { IMesibaIcon } from "src/hooks/useMesiba"
import { formatMesibaIcon } from "src/utils/icon-utils"

interface MesibaIconProps {
	icon: IMesibaIcon
}

export function MesibaIcon({ icon }: MesibaIconProps) {
	return (
		<IconItemRow>
			<IconLabel>{icon.heb_name}</IconLabel>
			<IconThumb src={formatMesibaIcon(icon.iconName)} alt={icon.heb_name} />
		</IconItemRow>
	)
}

const IconItemRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
  font-size: var(--fs-btn);
  color: var(--sea-ink);
`
