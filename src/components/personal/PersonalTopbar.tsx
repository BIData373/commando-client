import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui';
import {
  ClipboardList, User,
  ChevronDown, UserCircle, HelpCircle, Info, ChevronLeft,
} from 'lucide-react';

export type PersonalNavItem = 'instructions';

interface PersonalTopbarProps {
  activeItem: PersonalNavItem;
  onItemChange: (item: PersonalNavItem) => void;
  userName: string;
}

const navItems: { key: PersonalNavItem; label: string; icon: React.ReactNode }[] = [
  { key: 'instructions', label: 'ההנחיות שלי', icon: <ClipboardList className="w-5 h-5" /> },
];

export function PersonalTopbar({
  activeItem,
  onItemChange,
  userName,
}: PersonalTopbarProps) {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [profileOpen]);

  return (
    <header className="sticky top-0 z-40 px-4 pt-3 pb-0 bg-background">
      <div
        className="flex items-center justify-between text-white rounded-2xl px-6 h-[60px]"
        style={{
          background: '#131629',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.20), 0 4px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Right (RTL start): Profile + Notifications */}
        <div className="flex items-center gap-2">
          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-1 p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
              aria-label="תפריט משתמש"
            >
              <User className="w-5 h-5" />
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', profileOpen && 'rotate-180')} />
            </button>

            {profileOpen && (
              <div
                className="absolute top-full mt-2 start-0 z-50 w-64 rounded-xl py-2 text-text-primary"
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
                }}
              >
                {/* User info header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                    <p className="text-xs text-gray-400 truncate">yael@example.com</p>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <ProfileMenuItem
                    icon={<UserCircle className="w-5 h-5" />}
                    label="אזור אישי"
                    onClick={() => { setProfileOpen(false); onItemChange('instructions'); }}
                  />
                  <ProfileMenuItem
                    icon={<HelpCircle className="w-5 h-5" />}
                    label="עזרה ותמיכה"
                    onClick={() => setProfileOpen(false)}
                  />
                  <ProfileMenuItem
                    icon={<Info className="w-5 h-5" />}
                    label="עוד מאיתנו"
                    onClick={() => setProfileOpen(false)}
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Center: Nav buttons */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeItem === item.key;
            return (
              <Tooltip key={item.key} content={item.label}>
                <button
                  onClick={() => onItemChange(item.key)}
                  className={cn(
                    'p-2 rounded-lg transition-colors cursor-pointer',
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/8'
                  )}
                  aria-label={item.label}
                >
                  {item.icon}
                </button>
              </Tooltip>
            );
          })}
        </div>

        {/* Left (RTL end): Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          aria-label="חזרה לדף הבית"
        >
          <span className="text-xl font-bold tracking-tight">
            Comman<span className="text-secondary-light">Do</span>
          </span>
        </button>
      </div>
    </header>
  );
}

function ProfileMenuItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <span className="text-gray-400">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <ChevronLeft className="w-4 h-4 text-gray-300" />
    </button>
  );
}
