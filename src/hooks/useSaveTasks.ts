import { DeadlineType } from "src/api/model"
import { useCreateTask } from "../api/task/task"
import { useWorkspace } from "../providers/WorkspaceProvider"

interface TaskInput {
  title: string
  assigneeIds: number[]
  assigneeDetails: Record<number, string>
  deadlineType: DeadlineType | null
  dueDate: Date | null
  flagged: boolean
  notes: string
  tags?: string[]
  groupKey?: string
}

interface DiscussionFields {
  sourceId?: number
  issuedAt?: Date
}

export function useSaveTasks() {
  const { workspace } = useWorkspace()
  const { mutate: createTask } = useCreateTask()

  function saveTasks(inputs: TaskInput[], discussion: DiscussionFields) {
    for (const input of inputs) {
      createTask({
        data: {
          workspaceId: workspace.id,
          sourceId: discussion.sourceId,
          title: input.title.trim(),
          flagged: input.flagged,
          deadlineType: input.deadlineType ?? DeadlineType.ROLLING,
          dueDate: input.dueDate ?? new Date(),
          notes: input.notes || undefined,
          assigneeIds: input.assigneeIds,
          tags: input.tags,
        },
      })
    }
  }

  return saveTasks
}
