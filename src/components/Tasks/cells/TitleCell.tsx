import styled from "@emotion/styled"
import type { CellContext } from "@tanstack/react-table"
import { useCallback, useState } from "react"
import type { TaskRowDto } from "src/api/model"
import type { AppTableFeatures } from "src/consts/table-features"
import { useTaskTable } from "src/providers/TaskTableProvider"
import FlagIcon from "../../shared/FlagIcon"
import { TitleText } from "./TitleText"

const ROW_HEIGHT = 43

export function TitleCell<TTask extends TaskRowDto, TValue>({
	row: {
		original: { title, description, flagged },
	},
}: CellContext<AppTableFeatures, TTask, TValue>) {
	const { searchQuery, titleExpanded } = useTaskTable()
	const [isWrapped, setIsWrapped] = useState(false)

	const cellRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (!node || !titleExpanded) {
				setIsWrapped(false)
				return
			}

			const td = node.closest("td")
			if (!td) return

			const observer = new ResizeObserver(() => {
				setIsWrapped(td.clientHeight > ROW_HEIGHT)
			})

			observer.observe(td)

			return () => observer.disconnect()
		},
		[titleExpanded],
	)

	return (
		<CellRoot
			ref={cellRef}
			$expanded={titleExpanded}
			data-cell-wrapped={isWrapped ? "" : undefined}
		>
			{flagged && <FlagIcon />}
			<TitleText
				title={title}
				description={description}
				searchQuery={searchQuery}
				titleExpanded={titleExpanded}
			/>
		</CellRoot>
	)
}

const CellRoot = styled.div<{ $expanded: boolean }>`
  display: flex;
  align-items: ${({ $expanded }) => ($expanded ? "flex-start" : "center")};
  gap: 6px;
  color: var(--sea-ink);
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 20px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  cursor: pointer;
`
