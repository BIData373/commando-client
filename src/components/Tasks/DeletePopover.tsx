import {
	ConfirmPopover,
	type ConfirmPopoverProps,
} from "../shared/ConfirmPopover"

interface DeletePopoverProps extends ConfirmPopoverProps {
	count: number
}

export function DeletePopover({ count, title, ...props }: DeletePopoverProps) {
	return (
		<ConfirmPopover
			title={title ?? (count === 1 ? "מחיקת הנחיה" : `מחיקת ${count} הנחיות`)}
			description=".שים לב לא ניתן לבטל פעולה זו"
			confirmLabel={count === 1 ? "מחק הנחיה" : "מחק הנחיות"}
			openManually={true}
			{...props}
		/>
	)
}
