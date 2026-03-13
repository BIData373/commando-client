import styled from '@emotion/styled';
import { AlertTriangle } from 'lucide-react';
import Button from '../shared/Button';
import Dialog from '../shared/Dialog/Dialog';
import DialogContent from '../shared/Dialog/DialogContent';
import DialogFooter from '../shared/Dialog/DialogFooter';
import DialogHeader from '../shared/Dialog/DialogHeader';
import DialogTitle from '../shared/Dialog/DialogTitle';
import Spinner from '../shared/Spinner';

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  instructionTitle: string;
  isLoading: boolean;
}

export default function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  instructionTitle,
  isLoading,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} size="sm">
      <DialogHeader>
        <TitleRow>
          <WarningIconBox>
            <WarningIcon />
          </WarningIconBox>
          <DialogTitle>ביטול הנחיה</DialogTitle>
        </TitleRow>
      </DialogHeader>

      <DialogContent>
        <BodyText>
          האם לבטל את ההנחיה <strong>"{instructionTitle}"</strong>?
        </BodyText>
        <SubText>ההנחיה תועבר לארכיון ולא תוצג עוד ברשימה.</SubText>
      </DialogContent>

      <DialogFooter>
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          ביטול
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
          {isLoading && <Spinner $size={18} />}
          {isLoading ? 'מבטל...' : 'אשר ביטול'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const WarningIconBox = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: var(--color-error-light);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const WarningIcon = styled(AlertTriangle)`
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-error);
`;

const BodyText = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-primary);
`;

const SubText = styled.p`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
`;
