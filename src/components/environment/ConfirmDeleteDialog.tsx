import {
  Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter,
  Button, Spinner,
} from '@/components/ui';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  instructionTitle: string;
  isLoading: boolean;
}

export function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  instructionTitle,
  isLoading,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} size="sm">
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-error-light flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-error" />
          </div>
          <DialogTitle>ביטול הנחיה</DialogTitle>
        </div>
      </DialogHeader>

      <DialogContent>
        <p className="text-sm text-text-primary">
          האם לבטל את ההנחיה <strong>"{instructionTitle}"</strong>?
        </p>
        <p className="text-xs text-text-secondary mt-2">
          ההנחיה תועבר לארכיון ולא תוצג עוד ברשימה.
        </p>
      </DialogContent>

      <DialogFooter>
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          ביטול
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
          {isLoading && <Spinner size={18} className="me-2" />}
          {isLoading ? 'מבטל...' : 'אשר ביטול'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
