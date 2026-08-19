import { differenceInDays, format, startOfToday } from "date-fns"
import ExcelJS from "exceljs"
import {
	DeadlineType,
	type TaskRowDto,
	type TaskRowWithWorkspaceDto,
} from "src/api/model"
import { DEADLINE_LABELS } from "src/components/shared/DeadlineTag"
import { formatDate } from "./date-utils"

interface CellValue {
	value: string
	fontColor?: string
	bgColor?: string
	link?: string
}

interface ExportColumn<T> {
	header: string
	maxWidth?: number
	accessor: (row: T) => string | CellValue
}

function isCellValue(val: string | CellValue): val is CellValue {
	return typeof val === "object" && val !== null && "value" in val
}

const BORDER_COLOR = { argb: "FFAAAAAA" }

const THIN_BORDER: Partial<ExcelJS.Borders> = {
	top: { style: "thin", color: BORDER_COLOR },
	bottom: { style: "thin", color: BORDER_COLOR },
	left: { style: "thin", color: BORDER_COLOR },
	right: { style: "thin", color: BORDER_COLOR },
}

function toArgb(hex: string): string {
	return "FF" + hex.replace("#", "").toUpperCase().padStart(6, "0")
}

function lighten(hex: string, alpha: number): string {
	const channels = hex
		.replace("#", "")
		.match(/.{2}/g)!
		.map((v) => parseInt(v, 16))
	const blended = channels.map((c) => Math.round(255 * (1 - alpha) + c * alpha))
	return (
		"FF" +
		blended
			.map((v) => v.toString(16).padStart(2, "0"))
			.join("")
			.toUpperCase()
	)
}

function getDeadlineDateStyle(task: TaskRowDto): Pick<CellValue, "fontColor"> {
	if (!task.dueDate || task.deadlineType === DeadlineType.IMMEDIATE) {
		return {}
	}
	const today = startOfToday()
	const daysUntil = differenceInDays(task.dueDate, today)
	if (daysUntil < 0) return { fontColor: "#f5222d" }
	if (daysUntil < 2) return { fontColor: "#d46b08" }
	return {}
}

const COLUMN_DEFS: Partial<
	Partial<Record<keyof TaskRowWithWorkspaceDto, ExportColumn<TaskRowDto>>>
> = {
	title: {
		header: "ההנחיה",
		maxWidth: 60,
		accessor: (t) =>
			t.description ? `${t.title} – ${t.description}` : t.title,
	},
	status: {
		header: "סטטוס",
		accessor: (t) => ({
			value: t.status?.name ?? "",
			fontColor: t.status?.color,
			bgColor: t.status?.color,
		}),
	},
	assignee: {
		header: "אחראי",
		accessor: (t) => t.assignee?.name ?? "",
	},
	deadlineType: {
		header: 'תג"ב',
		accessor: (t) => {
			const typeStr = DEADLINE_LABELS[t.deadlineType] ?? ""
			const displayDate =
				t.deadlineType === DeadlineType.IMMEDIATE
					? (t.source?.date ?? t.createdAt)
					: t.dueDate
			const dateStr = displayDate ? formatDate(displayDate) : ""
			const value =
				typeStr && dateStr ? `${typeStr} | ${dateStr}` : typeStr || dateStr
			return { value, ...getDeadlineDateStyle(t) }
		},
	},
	source: {
		header: "מקור הנחיה",
		accessor: (t) => {
			if (!t.source) {
				return ""
			}

			const source = t.source.date
				? `${t.source.name} | ${formatDate(t.source.date)}`
				: t.source.name
			return t.source.attachmentKey
				? { value: source, link: t.source.attachmentKey }
				: source
		},
	},
	tags: {
		header: "נושא",
		accessor: (t) => t.tags.map(({ name }) => name).join(", "),
	},
	createdAt: {
		header: "תאריך יצירה",
		accessor: (t) => formatDate(t.createdAt),
	},
	updatedAt: {
		header: "עודכן ב",
		accessor: (t) => formatDate(t.updatedAt),
	},
	workspace: {
		header: "מפקד מנחה",
		accessor: (t) =>
			(t as Partial<TaskRowWithWorkspaceDto>).workspace?.title ?? "",
	},
}

export async function exportTasksToExcel<TTask extends TaskRowDto>(
	tasks: TTask[],
	columnOrder: (keyof TTask)[],
	hiddenColumns: Set<keyof TTask>,
	fileNamePrefix?: string,
) {
	await exportToExcel(
		tasks,
		[
			{
				header: 'מס"ד',
				accessor: (t) => String(t.id),
			},
			...columnOrder
				.filter((id) => !hiddenColumns.has(id) && id in COLUMN_DEFS)
				.map((id) => COLUMN_DEFS[id as keyof TaskRowWithWorkspaceDto])
				.filter((row) => !!row),
		],
		`${fileNamePrefix ? `${fileNamePrefix} - ` : ""} הנחיות ${format(new Date(), "yyyy-MM-dd HH-mm-ss")}`,
	)
}

function downloadFile(blob: Blob, fileName: string) {
	const url = URL.createObjectURL(blob)
	const a = document.createElement("a")
	a.href = url
	a.download = fileName
	a.click()
	URL.revokeObjectURL(url)
}

function getCellText(value: ExcelJS.CellValue): string {
	if (!value) return ""
	if (typeof value === "string") return value
	if (typeof value === "object" && "text" in value) return String(value.text)
	return String(value)
}

async function exportToExcel<T>(
	rows: T[],
	columns: ExportColumn<T>[],
	fileName: string,
) {
	const workbook = new ExcelJS.Workbook()
	const worksheet = workbook.addWorksheet("Sheet1", {
		views: [{ rightToLeft: true }],
	})

	worksheet.columns = columns.map((col) => ({ header: col.header }))

	const headerRow = worksheet.getRow(1)
	headerRow.eachCell((cell) => {
		cell.font = { bold: true }
		cell.alignment = { horizontal: "center", readingOrder: "rtl" }
		cell.border = THIN_BORDER
	})

	rows.forEach((row) => {
		const values = columns.map((col) => {
			const raw = col.accessor(row)
			return isCellValue(raw) ? raw.value : raw
		})
		const excelRow = worksheet.addRow(values)

		columns.forEach((col, colIdx) => {
			const raw = col.accessor(row)
			const cell = excelRow.getCell(colIdx + 1)
			const data = isCellValue(raw) ? raw : null

			cell.alignment = { horizontal: "center", readingOrder: "rtl" }
			cell.border = THIN_BORDER

			if (data?.fontColor) {
				cell.font = { color: { argb: toArgb(data.fontColor) } }
			}

			if (data?.bgColor) {
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: lighten(data.bgColor, 0.1) },
				}
			}

			if (data?.link) {
				cell.value = { text: data.value, hyperlink: data.link }
				cell.font = { underline: true, color: { argb: "FF0563C1" } }
			}
		})
	})

	// Auto-fit column widths based on longest content, with optional cap
	columns.forEach((col, colIdx) => {
		const excelCol = worksheet.getColumn(colIdx + 1)
		let maxLen = col.header.length
		excelCol.eachCell({ includeEmpty: false }, (cell) => {
			maxLen = Math.max(maxLen, getCellText(cell.value).length)
		})
		excelCol.width = Math.min(maxLen + 4, col.maxWidth ?? Infinity)
	})

	const buffer = await workbook.xlsx.writeBuffer()
	const blob = new Blob([buffer], {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	})
	downloadFile(blob, `${fileName}.xlsx`)
}
