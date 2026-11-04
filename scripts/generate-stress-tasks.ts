import { writeFileSync } from "node:fs"
import { faker } from "@faker-js/faker"
import type { TaskRowDto } from "../src/api/model"
import { getListTaskRowsResponseMock } from "../src/api/task/task.msw"

const TASKS_COUNT = Number(process.argv[2] ?? 10000)
const OUTPUT_PATH = process.argv[3] ?? "public/mocks/stress-tasks.json"
const TEMPLATE_ROWS_COUNT = 300
const MAX_TAGS_PER_ROW = 3
const MAX_OTHER_ASSIGNEES_PER_ROW = 2
const FAKER_SEED = 1
const MS_BETWEEN_TASKS = 60_000
const AUDIT_KEYS = new Set([
	"createdBy",
	"updatedBy",
	"deletedBy",
	"createdAt",
	"updatedAt",
	"deletedAt",
])

faker.seed(FAKER_SEED)

/** Nested audit blobs are random and huge; the table never reads them */
function pruneAudit(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(pruneAudit)
	if (value instanceof Date || value === null || typeof value !== "object") {
		return value
	}

	return Object.fromEntries(
		Object.entries(value)
			.filter(([key]) => !AUDIT_KEYS.has(key))
			.map(([key, nested]) => [key, pruneAudit(nested)]),
	)
}

function buildTemplate(row: TaskRowDto): TaskRowDto {
	const { source, tags, otherAssignees, ...rest } = row
	const [primary, ...others] = otherAssignees.map(pruneAudit) as {
		assignee: unknown
	}[]

	return {
		...rest,
		assignee: primary?.assignee,
		otherAssignees: others.slice(0, MAX_OTHER_ASSIGNEES_PER_ROW),
		tags: tags.slice(0, MAX_TAGS_PER_ROW).map(pruneAudit),
		source: source && {
			...(pruneAudit(source) as object),
			tags: source.tags?.slice(0, MAX_TAGS_PER_ROW).map(pruneAudit),
		},
	} as TaskRowDto
}

const templates: TaskRowDto[] = []
while (templates.length < TEMPLATE_ROWS_COUNT) {
	templates.push(...getListTaskRowsResponseMock().map(buildTemplate))
}

const now = Date.now()
const rows = Array.from({ length: TASKS_COUNT }, (_, index) => {
	const template = templates[index % TEMPLATE_ROWS_COUNT]
	const id = index + 1
	const createdAt = new Date(now - index * MS_BETWEEN_TASKS)

	return {
		...template,
		id,
		serialId: id,
		rowKey: `${id}_${(template.assignee as { id?: number } | undefined)?.id ?? 0}`,
		title: `Task ${id} ${template.title}`,
		createdAt,
		updatedAt: createdAt,
	}
})

writeFileSync(OUTPUT_PATH, JSON.stringify(rows))
console.log(`Wrote ${rows.length} tasks to ${OUTPUT_PATH}`)

process.exit(0)
