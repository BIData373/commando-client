import styled from "@emotion/styled"
import { TasksView } from "src/routes/workspace/$urlName/tasks"

interface ViewToggleProps {
	view: TasksView
	onViewChange: (view: TasksView) => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
	return (
		<SegmentedControl>
			<SegmentedItem
				$selected={view === TasksView.CARDS}
				onClick={() => onViewChange(TasksView.CARDS)}
			>
				כרטיסיות
			</SegmentedItem>
			<SegmentedItem
				$selected={view === TasksView.TABLE}
				onClick={() => onViewChange(TasksView.TABLE)}
			>
				טבלה
			</SegmentedItem>
		</SegmentedControl>
	)
}

const SegmentedControl = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 2px;
  background: var(--colors-base-neutral-3);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
`

const SegmentedItem = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 100%;
  padding-inline: 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
  background: ${({ $selected }) => ($selected ? "var(--background)" : "transparent")};
  color: ${({ $selected }) => ($selected ? "rgba(0, 0, 0, 0.88)" : "var(--text-color)")};
  box-shadow: ${({ $selected }) => ($selected ? "var(--card-shadow-default)" : "none")};
  &:hover {
    background: ${({ $selected }) => ($selected ? "var(--background)" : "rgba(0, 0, 0, 0.06)")};
  }
`
