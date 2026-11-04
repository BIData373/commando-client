import type { TaskRowDto } from "src/api/model"
import {
	getListTaskRowsMockHandler,
	getListTaskRowsResponseMock,
} from "src/api/task/task.msw"

const STRESS_TASKS_COUNT = Number(import.meta.env.VITE_STRESS_TASKS_COUNT ?? 0)

export const IS_STRESS_TASKS_ENABLED = STRESS_TASKS_COUNT > 0

function buildStressRows(count: number): TaskRowDto[] {
	const rows: TaskRowDto[] = []
	while (rows.length < count) {
		for (const row of getListTaskRowsResponseMock()) {
			const id = rows.length + 1
			rows.push({ ...row, id, serialId: id, title: `Task ${id} ${row.title}` })
			if (rows.length === count) break
		}
	}
	return rows
}

export function getStressTasksHandler() {
	const rows = buildStressRows(STRESS_TASKS_COUNT)
	return getListTaskRowsMockHandler(() => rows)
}
