import styled from "@emotion/styled"
import type { IMesibaIcon } from "src/hooks/useMesiba"
import { formatMesibaIcon } from "src/utils/icon-utils"

interface MesibaIconProps {
	icon: IMesibaIcon
}

export function MesibaIcon({ icon: { heb_name, iconName } }: MesibaIconProps) {
	return (
		<IconItemRow>
			<IconLabel title={heb_name}>{heb_name}</IconLabel>
			<IconThumb src={formatMesibaIcon(iconName)} alt={heb_name} />
		</IconItemRow>
	)
}

const IconItemRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-width: 0;
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
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  white-space: nowrap;
`
