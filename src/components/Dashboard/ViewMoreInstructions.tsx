import styled from '@emotion/styled'
import { useNavigate } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import type { QuickFilter } from '../Tasks/TaskFilters'
import type { FocusedTab } from './FocusedInstructions'

interface IViewInstruction {
    urlName: string
    filter?: FocusedTab
}

const quickerFilterTab: Record<FocusedTab, QuickFilter> = {
    'important': 'flagged',
    'immediate': 'approaching',
    'deviation': 'overdue',
}

export const ViewMoreInstructions = ({ urlName, filter }: IViewInstruction) => {
    const navigate = useNavigate()

    const quickerFilter = filter && quickerFilterTab[filter]

    function handleViewMore() {
        navigate({ to: '/workspace/$urlName/tasks', params: { urlName }, search: { view: 'TABLE', filter: quickerFilter } })
    }

    return (
        <ViewMoreButton onClick={handleViewMore}>
            צפה בעוד הנחיות
            <ChevronLeft size={16} />
        </ViewMoreButton>
    )
}

const ViewMoreButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 15px;
  font-size: 14px;
  color: var(--foreground);
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  align-self: flex-end;

  &:hover {
    background: var(--chip-bg);
  }
`