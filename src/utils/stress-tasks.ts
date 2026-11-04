import { bypass, http } from "msw"

const STRESS_TASKS_URL = "/mocks/stress-tasks.json"

export const IS_STRESS_TASKS_ENABLED =
	import.meta.env.VITE_STRESS_TASKS === "true"

/**
 * Serves the pre-generated tasks file (see `npm run stress:generate`) instead of
 * building rows at request time, so the mock adds no CPU cost to what is measured.
 */
export function getStressTasksHandler() {
	return http.get("*/task/rows", () => fetch(bypass(STRESS_TASKS_URL)))
}
