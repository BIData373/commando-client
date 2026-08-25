import styled from "@emotion/styled"
import { PrimaryButton } from "../shared/PrimaryButton"

interface StepFooterProps {
	primaryLabel: string
	onPrimary(): void
	secondaryLabel?: string
	onSecondary?(): void
	footnote?: string
}

export function StepFooter({
	primaryLabel,
	onPrimary,
	secondaryLabel,
	onSecondary,
	footnote,
}: StepFooterProps) {
	return (
		<Root>
			{footnote && <Footnote>{footnote}</Footnote>}
			<FooterRow>
				{secondaryLabel && (
					<SecondaryButton onClick={onSecondary}>
						{secondaryLabel}
					</SecondaryButton>
				)}
				<PrimaryButton height={30} title={primaryLabel} onClick={onPrimary} />
			</FooterRow>
		</Root>
	)
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  margin-block-start: auto;
`

const FooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 16px;
`

const Footnote = styled.p`
  font-size: var(--fs-sm);
  color: var(--sea-ink-soft);
  margin: 20px 0;
`

const SecondaryButton = styled.button`
  padding: 3px 15px;
  gap: 8px;
  border-radius: 6px;
  border: 1px solid var(--card-border);
  cursor: pointer;

  &:hover {
    background: var(--button-hover);
  }

  &:active {
    background: var(--button-active);
  }
`
