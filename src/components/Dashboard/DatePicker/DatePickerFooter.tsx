import styled from '@emotion/styled'
import type { DateRangePickerSlotProps } from '../DateRangePicker'

export function DatePickerFooter({ onRangeChange, onClose }: DateRangePickerSlotProps) {
    function handleClear() {
        onRangeChange(undefined)
    }

    function handleConfirm() {
        onClose()
    }

    return (
        <PopupFooter>
            <ClearButton onClick={handleClear}>נקה בחירה</ClearButton>
            <ConfirmButton onClick={handleConfirm}>אישור</ConfirmButton>
        </PopupFooter>
    )
}

const ClearButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--sea-ink-soft);
  font-size: 14px;
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: var(--sea-ink);
  }
`

const ConfirmButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 20px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(165deg, var(--purple-start) 0%, var(--purple-end) 100%);
  color: var(--primary-foreground);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.9;
  }
`

const PopupFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block-start: 4px;
`