import styled from "@emotion/styled"
import { ChevronDown } from "lucide-react"
import type { PropsWithChildren } from "react"
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "src/components/ui/accordion"

interface MobileFilterSectionProps extends PropsWithChildren {
	value: string
	label: string
}

export default function MobileFilterSection({
	value,
	label,
	children,
}: MobileFilterSectionProps) {
	return (
		<Section value={value}>
			<SectionHeader icon={<SectionChevron size={16} />}>{label}</SectionHeader>
			<SectionContent>{children}</SectionContent>
		</Section>
	)
}

const Section = styled(AccordionItem)`
	border-bottom: 1px solid var(--Bar-hover);
`

const SectionChevron = styled(ChevronDown)`
	flex-shrink: 0;
`

const SectionHeader = styled(AccordionTrigger)`
	align-items: center;
	padding: 20px 0;
	border: none;
	border-radius: 0;
	color: var(--text-color-2);
	font-size: var(--fs-xl);
	font-weight: 400;

	&:hover {
		text-decoration: none;
	}

	&[data-state="closed"] ${SectionChevron} {
		transform: rotate(90deg);
	}
`

const SectionContent = styled(AccordionContent)`
	height: auto;
	padding-bottom: 8px;
`
