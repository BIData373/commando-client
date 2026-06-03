import styled from "@emotion/styled"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface MetricsBarProps {
  totalCount: number
  notStartedCount: number
  inProgressCount: number
  weeklyNew: number
}

function MetricsBar({
  totalCount,
  notStartedCount,
  inProgressCount,
  weeklyNew,
}: MetricsBarProps) {
  const [open, setOpen] = useState(true)

  function toggleOpen() {
    setOpen((prev) => !prev)
  }

  // TODO - fix status tags here
  return (
    <MetricsSection>
      <CardsWrapper $open={open}>
        <CardsRow>
          <MetricCard>
            <CardHeader>
              <CardLabel>בעבודה</CardLabel>
              {/* <StatusTag status="in_progress" /> */}
            </CardHeader>
            <CardNumber>{inProgressCount}</CardNumber>
          </MetricCard>

          <MetricCard>
            <CardHeader>
              <CardLabel>טרם בוצעו</CardLabel>
              {/* <StatusTag status="not_started" /> */}
            </CardHeader>
            <CardNumber>{notStartedCount}</CardNumber>
          </MetricCard>

          <MetricCard $highlighted>
            <CardHeader>
              <CardLabel>סה"כ הנחיות שקיבלתי</CardLabel>
            </CardHeader>
            <CardFooter>
              <WeeklyBadge>
                <WeeklyText>השבוע</WeeklyText>
                <WeeklyText>+{weeklyNew}</WeeklyText>
              </WeeklyBadge>
              <CardNumber>{totalCount}</CardNumber>
            </CardFooter>
          </MetricCard>
        </CardsRow>
      </CardsWrapper>
      <CollapseToggle>
        <DividerLine />
        <CollapseButton onClick={toggleOpen}>
          <CollapseIcon size={14} $open={open} />
        </CollapseButton>
        <DividerLine />
      </CollapseToggle>
    </MetricsSection>
  )
}

export { MetricsBar }

const MetricsSection = styled.div`
  direction: ltr;
  display: flex;
  flex-direction: column;
  gap: 32px;
`

const CardsWrapper = styled.div<{ $open: boolean }>`
  overflow: hidden;
  max-height: ${({ $open }) => ($open ? "110px" : "0")};
  transition: max-height 420ms cubic-bezier(0.4, 0, 0.2, 1);
`

const CardsRow = styled.div`
  display: flex;
  gap: 48px;
`

const MetricCard = styled.div<{ $highlighted?: boolean }>`
  flex: 1;
  width: 587px;
  height: 89px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 4px;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid var(--colors-base-neutral-3);
  background: var(--background);
`

const CardHeader = styled.div`
  direction: rtl;
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
`

const CardLabel = styled.span`
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  color: var(--primary);
`

const CardNumber = styled.span`
  font-size: 38px;
  font-weight: 400;
  line-height: 46px;
  background: var(--default-linear);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const CardFooter = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  align-self: stretch;
`

const WeeklyBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`

const WeeklyText = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  color: var(--primary);
`

const CollapseToggle = styled.div`
  display: flex;
  align-items: center;
`

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: var(--card-border);
`

const CollapseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  border: 1px solid var(--card-border);
  background: var(--background);
  cursor: pointer;

  &:hover {
    background: var(--link-bg-hover);
  }
`

const CollapseIcon = styled(ChevronDown) <{ $open: boolean }>`
  color: var(--text-color-2);
  transition: transform 420ms cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0)")};
`
