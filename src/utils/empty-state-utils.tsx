import type { DateRange } from "react-day-picker"
import { QuickFilter } from "src/api/model"
import emptyState from "../assets/empty-states/empty-state.svg"
import noResultsFound from "../assets/empty-states/no-results-found.svg"
import type { EmptyCardStateProps } from "../components/shared/EmptyCardState"

type EmptyStateKey = QuickFilter | "search" | "dateRange" | "noData" | "default"

export type DashboardEmptyStateKey = QuickFilter | "completed"

const EMPTY_STATES: Record<EmptyStateKey, EmptyCardStateProps> = {
	[QuickFilter.overdue]: {
		imgSrc: noResultsFound,
		title: (
			<>
				לא נמצאו הנחיות
				<br /> בחריגה מתג"ב
			</>
		),
		description: "יש לנסות סינון אחר",
	},
	[QuickFilter.approaching]: {
		imgSrc: noResultsFound,
		title: (
			<>
				לא נמצאו הנחיות
				<br /> עם תג"ב מתקרב
			</>
		),
		description: "יש לנסות סינון אחר",
	},
	[QuickFilter.flagged]: {
		imgSrc: noResultsFound,
		title: <>לא נמצאו הנחיות חשובות</>,
		description: "יש לנסות סינון אחר",
	},
	search: {
		imgSrc: noResultsFound,
		title: "לא הצלחנו למצוא הנחיות",
		description: "יש לנסות ניסוח אחר או לבדוק אם ההנחיה נמצאת בארכיון",
	},
	dateRange: {
		imgSrc: noResultsFound,
		title: "לא נמצאו הנחיות בטווח התאריכים שנבחר",
		description: "יש לנסות טווח תאריכים אחר או לנקות את הסינון",
	},
	noData: {
		imgSrc: emptyState,
		title: "טרם נוצרו הנחיות",
		description: `לאחר שהנחיות יוצרו,
		ההנחיות האחרונות יופיעו כאן`,
	},
	default: {
		imgSrc: noResultsFound,
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
	if (searchQuery) {
		return EMPTY_STATES.search
	}

	const activeFilter = [...activeFilters].find((filter) => EMPTY_STATES[filter])
	if (activeFilter) {
		return EMPTY_STATES[activeFilter]
	}

	if (dateRange) {
		return EMPTY_STATES.dateRange
	}

	if (!hasData) {
		return EMPTY_STATES.noData
	}

	return EMPTY_STATES.default
}

export const DASHBOARD_EMPTY_STATES: Record<
	DashboardEmptyStateKey,
	EmptyCardStateProps
> = {
	[QuickFilter.flagged]: {
		imgSrc: noResultsFound,
		title: "לא נמצאו הנחיות חשובות",
		description: "לאחר שהנחיות יוגדרו כחשובות,\nההנחיות האחרונות יופיעו כאן",
	},
	[QuickFilter.approaching]: {
		imgSrc: noResultsFound,
		title: "לא נמצאו הנחיות לביצוע מיידי",
		description: "הנחיות לביצוע מידיות יופיעו כאן",
	},
	[QuickFilter.overdue]: {
		imgSrc: noResultsFound,
		title: 'לא נמצאו חריגות מתג"ב',
		description: 'חריגות מתג"ב יופיעו כאן',
	},
	completed: {
		imgSrc: emptyState,
		title: "טרם בוצעו הנחיות",
		description: "לאחר שהנחיות יבצעו,\nההנחיות האחרונות יופיעו כאן",
	},
}
