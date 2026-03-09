import { useNavigate } from 'react-router-dom';
import { ArrowRight, History, CheckCircle2, Clock, Archive as ArchiveIcon, AlertCircle } from 'lucide-react';
import type { Instruction, InstructionStatus } from '@/types';

interface InstructionHeaderProps {
  instruction: Instruction;
  envId: string;
  onOpenActivity: () => void;
}

const STATUS_BADGE: Record<InstructionStatus, { label: string; icon: React.ReactNode; className: string }> = {
  open: {
    label: 'ממתין לביצוע',
    icon: <AlertCircle size={12} />,
    className: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  in_progress: {
    label: 'בביצוע',
    icon: <Clock size={12} />,
    className: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  completed: {
    label: 'בוצע',
    icon: <CheckCircle2 size={12} />,
    className: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  archived: {
    label: 'בארכיון',
    icon: <ArchiveIcon size={12} />,
    className: 'bg-slate-50 text-slate-500 border-slate-200',
  },
};

export function InstructionHeader({ instruction, envId, onOpenActivity }: InstructionHeaderProps) {
  const navigate = useNavigate();
  const badge = STATUS_BADGE[instruction.status];

  return (
    <div className="bg-white border-b border-slate-100 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/env/${envId}`)}
          className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 cursor-pointer"
          aria-label="חזרה"
        >
          <ArrowRight size={20} />
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-900">{instruction.title}</h1>
          <span className={`${badge.className} text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border`}>
            {badge.icon}
            {badge.label}
          </span>
        </div>
      </div>

      <button
        onClick={onOpenActivity}
        className="flex items-center gap-2 text-sm text-slate-500 font-medium hover:text-indigo-600 transition-colors cursor-pointer"
      >
        <History size={18} />
        יומן פעילות
      </button>
    </div>
  );
}
