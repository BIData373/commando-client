import styled from "@emotion/styled";
import { CalendarDays, ChevronDown } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { formatDateMonthFullYear, formatDay } from "src/utils/timeFormat";

interface DashboardDatePickerTriggerButtonProps {
  label: string;
  range?: DateRange;
  ref?: React.Ref<HTMLButtonElement>;
}

export const DashboardDatePickerTriggerButton = ({ label, range, ref, ...props }: DashboardDatePickerTriggerButtonProps) => {
  return (
    <TriggerButton ref={ref} {...props}>
      <CalendarDays size={16} />
      {label && range?.from && range.to ? (
        <RangeLabel>
          {label}: {formatDay(range.from)}-{formatDateMonthFullYear(range.to)}
        </RangeLabel>
      ) : (
        <RangeLabel>טווח תאריכים</RangeLabel>
      )}
      <ChevronDown size={16} />
    </TriggerButton>
  );
}

const RangeLabel = styled.span`
    font-size: 16px;
`;

const TriggerButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 18px 15px;
  border: 1px solid var(--purple-start);
  color:var(--purple-start);
  border-radius: 8px;
  background: var(--background);
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  white-space: nowrap;
  align-self: flex-end;
  transition: opacity 0.15s;

  & > * {
    background: var(--purple-start);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &:hover {
    opacity: 0.8;
  }
`;
