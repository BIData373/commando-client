import type { DateRange } from "react-day-picker"
import emptyStateImage from "../../public/empty-state.svg"
import compleateInstruction from "../assets/icons/completeInstruction.svg"
import searchInstruction from "../assets/icons/searchInstruction.svg"
import type { EmptyCardStateProps } from "../components/shared/EmptyCardState"
import { QuickFilter } from "./filter-utils"

type EmptyStateKey = QuickFilter | "search" | "dateRange" | "noData" | "default"

export type DashboardEmptyStateKey =
	| "dashboardFlagged"
	| "dashboardApproaching"
	| "dashboardOverdue"
	| "dashboardCompleted"

const EMPTY_STATES: Record<EmptyStateKey, EmptyCardStateProps> = {
	[QuickFilter.OVERDUE]: {
		imgSrc: searchInstruction,
		title: (
			<>
				לא נמצאו הנחיות
				<br /> בחריגה מתג"ב
			</>
		),
		description: "יש לנסות סינון אחר",
	},
	[QuickFilter.APPROACHING]: {
		imgSrc: searchInstruction,
		title: (
			<>
				לא נמצאו הנחיות
				<br /> עם תג"ב מתקרב
			</>
		),
		description: "יש לנסות סינון אחר",
	},
	[QuickFilter.FLAGGED]: {
		imgSrc: searchInstruction,
		title: <>לא נמצאו הנחיות חשובות</>,
		description: "יש לנסות סינון אחר",
	},
	search: {
		imgSrc: searchInstruction,
		title: "לא הצלחנו למצוא הנחיות",
		description: "יש לנסות ניסוח אחר או לבדוק אם ההנחיה נמצאת בארכיון",
	},
	dateRange: {
		imgSrc: searchInstruction,
		title: "לא נמצאו הנחיות בטווח התאריכים שנבחר",
		description: "יש לנסות טווח תאריכים אחר או לנקות את הסינון",
	},
	noData: {
		imgSrc: emptyStateImage,
		title: "טרם נוצרו הנחיות",
		description: "לאחר שהנחיות יוצרו, ההנחיות האחרונות יופיעו כאן",
	},
	default: {
		imgSrc: searchInstruction,
		title: "לא נמצאו הנחיות מתאימות לסינון",
		description: "יש לנסות סינון אחר או לנקות את כל הפילטרים",
	},
}

export function getEmptyState(
	activeFilters: Set<QuickFilter>,
	searchQuery: string,
	hasData: boolean,
	dateRange?: DateRange,
): EmptyCardStateProps {
	if (searchQuery) return EMPTY_STATES.search
	for (const filter of activeFilters) {
		if (EMPTY_STATES[filter]) return EMPTY_STATES[filter]
	}
	if (dateRange) return EMPTY_STATES.dateRange
	if (!hasData) return EMPTY_STATES.noData
	return EMPTY_STATES.default
}

const DASHBOARD_EMPTY_STATES: Record<
	DashboardEmptyStateKey,
	EmptyCardStateProps
> = {
	dashboardFlagged: {
		imgSrc: searchInstruction,
		title: "לא נמצאו הנחיות חשובות",
		description: "לאחר שהנחיות יוגדרו כחשובות,\nההנחיות האחרונות יופיעו כאן",
	},
	dashboardApproaching: {
		imgSrc: searchInstruction,
		title: "לא נמצאו הנחיות לביצוע מיידי",
		description: "הנחיות לביצוע מידיות יופיעו כאן",
	},
	dashboardOverdue: {
		imgSrc: searchInstruction,
		title: 'לא נמצאו חריגות מתג"ב',
		description: 'חריגות מתג"ב יופיעו כאן',
	},
	dashboardCompleted: {
		imgSrc: compleateInstruction,
		title: "טרם בוצעו הנחיות",
		description: "לאחר שהנחיות יבצעו,\nההנחיות האחרונות יופיעו כאן",
	},
}

export function getDashboardEmptyState(
	key: DashboardEmptyStateKey,
): EmptyCardStateProps {
	return DASHBOARD_EMPTY_STATES[key]
}
