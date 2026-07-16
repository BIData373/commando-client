import styled from "@emotion/styled"
import { X } from "lucide-react"
import type { ReactNode } from "react"
import { ExtractionStatus } from "src/api/model"

// ─── Types ──────────────────────────────────────────────────────────────────

enum AlertType {
	Error = "error",
	Warning = "warning",
	Success = "success",
}

interface AIExtractionAlertProps {
	status: ExtractionStatus
	count: number
	onRetry: () => void
	onDismiss: () => void
	isRetrying?: boolean
}

// ─── Alert Helpers ───────────────────────────────────────────────────────────

const alertTypeByStatus: Record<ExtractionStatus, AlertType> = {
	[ExtractionStatus.PENDING]: AlertType.Success,
	[ExtractionStatus.IN_PROGRESS]: AlertType.Success,
	[ExtractionStatus.BACKEND_ERROR]: AlertType.Error,
	[ExtractionStatus.AI_SERVICE_ERROR]: AlertType.Error,
	[ExtractionStatus.FINISHED_WITHOUT_TASKS]: AlertType.Warning,
	[ExtractionStatus.FINISHED_WITH_TASKS]: AlertType.Success,
}

const alertTitleByType: Record<AlertType, (count: number) => string> = {
	[AlertType.Error]: () => "הפעולה נכשלה",
	[AlertType.Warning]: () => "לא נמצאו הנחיות בקובץ",
	[AlertType.Success]: (count) => `${count} הנחיות חולצו בהצלחה!`,
}

const alertTextByType: Record<AlertType, ReactNode> = {
	[AlertType.Error]: "תקלה טכנית – ניתן למלא בצורה ידנית או לנסות שנית.",
	[AlertType.Warning]:
		"ניתן להעלות קובץ מפורט יותר או להוסיף את ההנחיות בצורה ידנית.",
	[AlertType.Success]:
		"ההנחיות חולצו בצורה אוטומטית, כדאי לבדוק שהכול תקין לפני השמירה שלהן.",
}

// ─── Component ──────────────────────────────────────────────────────────────

function AIExtractionAlert({
	status,
	count,
	onRetry,
	onDismiss,
	isRetrying,
}: AIExtractionAlertProps) {
	const type = alertTypeByStatus[status]
	return (
		<ExtractionAlert $type={type}>
			<AlertBody>
				<AlertTitle>{alertTitleByType[type](count)}</AlertTitle>
				<AlertText>{alertTextByType[type]}</AlertText>
			</AlertBody>
			<AlertActions>
				{type === AlertType.Error && (
					<RetryButton onClick={onRetry} disabled={isRetrying}>
						נסה שנית
					</RetryButton>
				)}
				<AlertDismiss onClick={onDismiss}>
					<X size={16} />
				</AlertDismiss>
			</AlertActions>
		</ExtractionAlert>
	)
}

export default AIExtractionAlert

// ─── Alert Styled Components ─────────────────────────────────────────────────

const alertColors: Record<
	AlertType,
	{ bg: string; border: string; icon: string }
> = {
	[AlertType.Error]: { bg: "#fff1f0", border: "#ffccc7", icon: "#ff4d4f" },
	[AlertType.Warning]: { bg: "#fffbe6", border: "#ffe58f", icon: "#faad14" },
	[AlertType.Success]: { bg: "#f6ffed", border: "#b7eb8f", icon: "#52c41a" },
}

const ExtractionAlert = styled.div<{ $type: AlertType }>`
  direction: rtl;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid ${({ $type }) => alertColors[$type].border};
  background: ${({ $type }) => alertColors[$type].bg};
  flex-shrink: 0;
  margin-block-end: 8px;
`

const AlertBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: start;
`

const AlertTitle = styled.span`
  font-size: var(--fs-base);
  font-weight: 600;
  color: var(--foreground);
`

const AlertText = styled.span`
  font-size: var(--fs-sm);
  font-weight: 400;
  color: var(--text-color-2);
`

const AlertActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`

const RetryButton = styled.button`
  height: 24px;
  padding-inline: 12px;
  border-radius: 4px;
  border: 1px solid var(--card-border);
  background: var(--background);
  color: var(--foreground);
  font-size: var(--fs-sm);
  font-weight: 400;
  cursor: pointer;
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--background-area);
  }
`

const AlertDismiss = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--text-color-2);
  display: flex;
  align-items: center;
  flex-shrink: 0;

  &:hover {
    opacity: 0.7;
  }
`
