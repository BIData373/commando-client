import styled from "@emotion/styled";
import { ChevronDown } from "lucide-react";
import { type IUser, UserRole } from "#/types";
import { AssigneeAvatar } from "../shared/AssigneeAvatar";
import {
    type DirectiveStatus,
    getStatusStyle,
    STATUS_KEYS,
    STATUS_LABELS,
    StatusTag,
} from "../shared/StatusTag";
import type { RelatedDirective } from "../Tasks/ResponsibleCell";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface AssigneeSectionProps {
    currentUser: IUser;
    status: DirectiveStatus;
    relatedDirectives: RelatedDirective[];
    onDirectiveStatusChange: (
        assigneeId: number,
        status: DirectiveStatus,
    ) => void;
}

export const AssigneeSection = ({
    currentUser,
    relatedDirectives,
    onDirectiveStatusChange,
}: AssigneeSectionProps) => {
    const isAdmin = currentUser.role === UserRole.ADMIN;

    const myGroups = relatedDirectives.filter((d) =>
        d.user.userIds.includes(currentUser.id),
    );
    const otherGroups = relatedDirectives.filter(
        (d) => !d.user.userIds.includes(currentUser.id),
    );

    function renderRow(assignee: RelatedDirective, editable: boolean) {
        const canEdit = editable && (isAdmin || assignee.user.canEdit);

        return (
            <AssigneeRowContainer key={assignee.user.id} $white={editable && !isAdmin}>
                <AssigneeInfoBlock>
                    <AssigneeAvatar assignee={assignee.user} />
                    <AssigneeRoleText>{assignee.user.role}</AssigneeRoleText>
                </AssigneeInfoBlock>
                {canEdit ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <StatusPillTrigger $status={assignee.status}>
                                {STATUS_LABELS[assignee.status]}
                                <ChevronDown size={12} />
                            </StatusPillTrigger>
                        </DropdownMenuTrigger>
                        <StatusDropdownContent align="center" sideOffset={6}>
                            {STATUS_KEYS.map((s) => (
                                <StatusDropdownItem
                                    key={s}
                                    $selected={s === assignee.status}
                                    onSelect={() => onDirectiveStatusChange(assignee.user.id, s)}
                                >
                                    <StatusTag status={s} />
                                </StatusDropdownItem>
                            ))}
                        </StatusDropdownContent>
                    </DropdownMenu>
                ) : (
                    <StatusTag status={assignee.status} />
                )}
            </AssigneeRowContainer>
        );
    }

    if (isAdmin) {
        const isMultiple = relatedDirectives.length >= 2;
        return (
            <Section>
                <SectionLabel>
                    {isMultiple ? "אחראי לביצוע" : "אחראים לביצוע"}
                </SectionLabel>
                {relatedDirectives.length === 0 ? (
                    <SectionValue>לא הוגדר</SectionValue>
                ) : (
                    <AssigneesContainer>
                        <AssigneeRowsList>
                            {relatedDirectives.map((item) => renderRow(item, true))}
                        </AssigneeRowsList>
                    </AssigneesContainer>
                )}
            </Section>
        );
    }

    return (
        <Section>
            <SectionLabel>אחריותך לביצוע</SectionLabel>
            {myGroups.length === 0 ? (
                <SectionValue>לא הוגדר</SectionValue>
            ) : (
                <AssigneesContainer>
                    <AssigneeRowsList>
                        {myGroups.map((item) => renderRow(item, true))}
                    </AssigneeRowsList>
                </AssigneesContainer>
            )}

            {otherGroups.length > 0 && (
                <>
                    <SectionLabel>אחראים נוספים לביצוע</SectionLabel>
                    <AssigneesContainer>
                        <AssigneeRowsList>
                            {otherGroups.map((item) => renderRow(item, false))}
                        </AssigneeRowsList>
                    </AssigneesContainer>
                </>
            )}
        </Section>
    );
};

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  align-items: flex-start;
`;

const SectionLabel = styled.p`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: var(--sea-ink);
  text-align: end;
  white-space: nowrap;
`;

const SectionValue = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color);
  text-align: end;
`;

const AssigneesContainer = styled.div`
  width: 100%;
`;

const AssigneeRowsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const StatusPillTrigger = styled.button<{ $status: DirectiveStatus }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 1px 8px;
  border-radius: 56px;
  width: 76px;
  max-width: 76px;
  border: none;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  cursor: pointer;
  ${({ $status }) => {
        const { fontColor, bgColor } = getStatusStyle($status);
        return `background: ${bgColor}; color: ${fontColor};`;
    }}

  &:focus-visible {
    outline: none;
  }
`;

const StatusDropdownContent = styled(DropdownMenuContent)`
  width: 100px;
  min-width: 100px;
  padding: 8px 4px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  z-index: 1000;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px rgba(0, 0, 0, 0.12),
    0px 9px 28px rgba(0, 0, 0, 0.05);
`;

const StatusDropdownItem = styled(DropdownMenuItem) <{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 4px;
  border-radius: 4px;
  background: ${({ $selected }) => ($selected ? "rgba(230, 244, 255, 1)" : "transparent")};
  cursor: pointer;
  outline: none;

  &[data-highlighted],
  &:hover {
    background: rgba(230, 244, 255, 1);
    color: inherit;
  }
`;

const AssigneeRowContainer = styled.div<{ $white?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 24px;
  padding: 7px 12px;
  background: ${({ $white }) => ($white ? "var(--background)" : "#fcfcfc")};
  border: 0.5px solid #F0F0F0;
  border-radius: 8px;
  width: 100%;
`;

const AssigneeInfoBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  justify-content: flex-start;
  width: 161px;
`;

const AssigneeRoleText = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  white-space: nowrap;
`;
