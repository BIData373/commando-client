import styled from '@emotion/styled'
import { useNavigate } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'

interface IViewInstruction {
    urlName: string
}

export const ViewMoreInstructions = ({ urlName }: IViewInstruction) => {
    const navigate = useNavigate()

    function handleViewMore() {
        navigate({ to: '/workspace/$urlName/tasks', params: { urlName }, search: { view: 'TABLE' } })
    }

    return (
        <ViewMoreButton onClick={handleViewMore}>
            <ChevronLeft size={16} />
            צפה בעוד הנחיות
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