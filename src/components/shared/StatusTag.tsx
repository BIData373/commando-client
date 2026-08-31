import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { TbChevronDown } from "react-icons/tb"
import type { WorkspaceStatusDto } from "src/api/model"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface StatusTagProps {
	status: Pick<WorkspaceStatusDto, "name" | "color">
	interactive?: boolean
	editable?: boolean
	withArrow?: boolean
	open?: boolean
}

export function StatusTag({
	status: { name, color },
	interactive,
	editable,
	withArrow = false,
	open = false,
}: StatusTagProps) {
	const tag = (
		<Tag
			$fontColor={color}
			$backgroundColor={color}
			$interactive={interactive}
			$editable={editable}
			$withArrow={withArrow}
		>
			{withArrow && <Arrow size={12} $open={open} />}
			<Label $withArrow={withArrow}>
				<Text>{name}</Text>
			</Label>
			{withArrow && <Reserve />}
		</Tag>
	)

	return editable ? (
		tag
	) : (
		<Tooltip>
			<TooltipTrigger asChild>{tag}</TooltipTrigger>
			<TooltipContent>לא קיימות הרשאות עריכה</TooltipContent>
		</Tooltip>
	)
}

const Arrow = styled(TbChevronDown)<{ $open: boolean }>`
  flex-shrink: 0;
  color: var(--text-color-2);
  transition: transform 0.2s ease;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
`

const Reserve = styled.span`
  flex-shrink: 1;
  flex-basis: 14px;
  min-width: 0;
`

const Label = styled.span<{ $withArrow: boolean }>`
  display: flex;
  justify-content: center;
  overflow: hidden;
  ${({ $withArrow }) =>
		$withArrow
			? css`
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: auto;
  max-width: 48px;
  `
			: css`
  flex: 1;
  min-width: 0;
  `}
`

const Text = styled.span`
  direction: rtl;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Tag = styled.span<{
	$fontColor: string
	$backgroundColor: string
	$interactive?: boolean
	$editable?: boolean
	$withArrow?: boolean
}>`
  direction: ltr;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  width: 76px;
  padding: ${({ $withArrow }) => ($withArrow ? "1px 0 1px 8px" : "1px 8px")};
  border-radius: 999px;
  font-size: var(--fs-sm);
  line-height: 20px;
  white-space: nowrap;
  cursor: ${({ $interactive, $editable }) =>
		$interactive ? ($editable ? "pointer" : "not-allowed") : "default"};
  ${({ $fontColor }) => css`color: ${$fontColor};`}
  ${({ $backgroundColor }) => css`background:  rgb(from ${$backgroundColor} r g b / 0.1);`}

  :focus-visible {
    outline: none;
  }

  ${({ $editable, $backgroundColor }) =>
		$editable &&
		css`
  :hover {
    background: rgb(from ${$backgroundColor} r g b / 0.2);
  }
  `}
`
