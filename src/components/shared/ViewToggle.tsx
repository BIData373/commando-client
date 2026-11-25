import styled from "@emotion/styled"

export interface ViewToggleOption<TView extends string> {
	value: TView
	label: string
	testId?: string
}

interface ViewToggleProps<TView extends string> {
	options: ViewToggleOption<TView>[]
	view: TView
	onViewChange: (view: TView) => void
}

export function ViewToggle<TView extends string>({
	options,
	view,
	onViewChange,
}: ViewToggleProps<TView>) {
	return (
		<SegmentedControl>
			{options.map(({ value, label, testId }) => (
				<SegmentedItem
					key={value}
					data-testid={testId}
					$selected={view === value}
					onClick={() => onViewChange(value)}
				>
					{label}
				</SegmentedItem>
			))}
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
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 24px;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
  background: ${({ $selected }) => ($selected ? "var(--background)" : "transparent")};
  color: ${({ $selected }) => ($selected ? "var(--text-color-2)" : "var(--text-color)")};
  box-shadow: ${({ $selected }) => ($selected ? "var(--card-shadow-default)" : "none")};
  &:hover {
    background: ${({ $selected }) => ($selected ? "var(--background)" : "var(--button-hover)")};
  }
`
