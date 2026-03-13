import {
  BookOpen,
  Briefcase,
  Building2,
  Code,
  Globe,
  GraduationCap,
  Landmark,
  Lightbulb,
  Megaphone,
  Rocket,
  Shield,
  Swords,
} from 'lucide-react';

export interface EnvironmentFormData {
  name: string;
  iconName: string;
  managerIds: string[];
}

export const UNIT_OPTIONS: { name: string; label: string; icon: React.ElementType }[] = [
  { name: 'Briefcase', label: 'מטה כללי', icon: Briefcase },
  { name: 'Shield', label: 'אגף מבצעים', icon: Shield },
  { name: 'Swords', label: 'פיקוד צפון', icon: Swords },
  { name: 'Rocket', label: 'חיל האוויר', icon: Rocket },
  { name: 'Globe', label: 'חיל הים', icon: Globe },
  { name: 'Landmark', label: 'אגף התכנון', icon: Landmark },
  { name: 'Lightbulb', label: 'אגף המודיעין', icon: Lightbulb },
  { name: 'Code', label: 'אגף התקשוב', icon: Code },
  { name: 'Building2', label: 'בסיס אימונים', icon: Building2 },
  { name: 'GraduationCap', label: 'בי"ס לקצינים', icon: GraduationCap },
  { name: 'BookOpen', label: 'מרכז הדרכה', icon: BookOpen },
  { name: 'Megaphone', label: 'דובר צה"ל', icon: Megaphone },
];

export function getIconComponent(name: string): React.ElementType {
  return UNIT_OPTIONS.find((o) => o.name === name)?.icon || Briefcase;
}

export function getIconLabel(name: string): string {
  return UNIT_OPTIONS.find((o) => o.name === name)?.label || name;
}
