import { Spinner } from '@/components/ui';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'טוען נתונים...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Spinner size={40} />
      <p className="text-sm text-text-secondary">{message}</p>
    </div>
  );
}
