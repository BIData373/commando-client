import styled from "@emotion/styled";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useDeleteAssignee } from "src/api/assignee/assignee";
import { TrashButton } from "../shared/TrashButton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface DeleteAssigneePopconfirmProps {
    assigneeId: number;
}

export function DeleteAssigneePopconfirm({
    assigneeId,
}: DeleteAssigneePopconfirmProps) {
    const [open, setOpen] = useState(false);
    const { isPending, mutate: deleteAssignee } = useDeleteAssignee();

    function handleTriggerClick(e: React.MouseEvent) {
        e.stopPropagation();
    }

    function handleCloseAutoFocus(e: Event) {
        e.preventDefault();
    }

    function handleDelete(e: React.MouseEvent) {
        e.stopPropagation();
        deleteAssignee({ pathParams: { id: assigneeId } });
        setOpen(false);
    }

    function handleCancel(e: React.MouseEvent) {
        e.stopPropagation();
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild onClick={handleTriggerClick}>
                <TrashButton onClick={handleTriggerClick} />
            </PopoverTrigger>
            <StyledPopoverContent
                side="bottom"
                align="start"
                sideOffset={8}
                onCloseAutoFocus={handleCloseAutoFocus}
            >
                <HeadRow>
                    <TextWrapper>
                        <Title>למחוק את האחראי</Title>
                        <Description>
                            האם אתה בטוח? מחיקת האחראי תבטל את שיוך ההנחיות שהוא קיבל
                            <br />
                            הנחיות אלו ימשיכו להופיע בלשכה
                        </Description>
                    </TextWrapper>
                    <WarningIcon size={16} />
                </HeadRow>
                <ButtonsRow>
                    <CancelButton type="button" onClick={handleCancel}>
                        לא
                    </CancelButton>
                    <DeleteButton
                        type="button"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        מחק
                    </DeleteButton>
                </ButtonsRow>
            </StyledPopoverContent>
        </Popover>
    );
}

const StyledPopoverContent = styled(PopoverContent)`
    background: var(--background);
    border-radius: 6px;
    padding: 12px;
    gap: 8px;
    min-width: 220px;
    direction: rtl;
    display: flex;
    flex-direction: column;
`;

const HeadRow = styled.div`
    display: flex;
    flex-direction: row-reverse;
    gap: 8px;
`;

const TextWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    text-align: end;
`;

const Title = styled.p`
    font-size: 14px;
    font-weight: 500;
    color: var(--text-color-2);
    margin: 0;
    align-self: flex-start;
`;

const Description = styled.p`
    font-size: 14px;
    font-weight: 400;
    color: var(--text-color-2);
    line-height: 22px;
    margin: 0;
    direction: ltr;
`;

const WarningIcon = styled(AlertCircle)`
    color: #faad14;
    flex-shrink: 0;
    margin-block-start: 3px;
`;

const ButtonsRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: flex-end;
`;

const DeleteButton = styled.button`
    background: #ff4d4f;
    color: white;
    border: none;
    border-radius: 4px;
    height: 24px;
    padding-inline: 7px;
    font-size: 14px;
    cursor: pointer;
    line-height: 22px;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const CancelButton = styled.button`
    background: white;
    color: black;
    color: rgba(0, 0, 0, 0.88);
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    height: 24px;
    padding-inline: 7px;
    font-size: 14px;
    cursor: pointer;
    line-height: 22px;
`;
