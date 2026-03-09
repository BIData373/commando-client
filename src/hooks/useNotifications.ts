import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { Notification, NotificationPreferences } from '@/types';
import type { NotificationDto, NotificationPreferencesDto } from '@/mocks/data/notifications';

export const notificationKeys = {
  all: ['notifications'] as const,
  preferences: ['notification-preferences'] as const,
};

function mapNotification(dto: NotificationDto): Notification {
  return {
    id: dto.id,
    type: dto.type,
    title: dto.title,
    body: dto.body,
    read: dto.read,
    instructionId: dto.instruction_id,
    environmentId: dto.environment_id,
    environmentName: dto.environment_name,
    createdAt: new Date(dto.created_at),
  };
}

function mapPreferences(dto: NotificationPreferencesDto): NotificationPreferences {
  return {
    newInstruction: dto.new_instruction,
    approachingDue: dto.approaching_due,
    approachingDueDays: dto.approaching_due_days,
    overdue: dto.overdue,
    summaryReport: dto.summary_report,
    summaryFrequencyDays: dto.summary_frequency_days,
    summaryDayOfWeek: dto.summary_day_of_week,
    channel: dto.channel,
  };
}

function preferencesToDto(prefs: NotificationPreferences): NotificationPreferencesDto {
  return {
    new_instruction: prefs.newInstruction,
    approaching_due: prefs.approachingDue,
    approaching_due_days: prefs.approachingDueDays,
    overdue: prefs.overdue,
    summary_report: prefs.summaryReport,
    summary_frequency_days: prefs.summaryFrequencyDays,
    summary_day_of_week: prefs.summaryDayOfWeek,
    channel: prefs.channel,
  };
}

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.all,
    queryFn: async (): Promise<Notification[]> => {
      const data = await apiClient.get<NotificationDto[]>('/notifications');
      return data.map(mapNotification);
    },
  });
}

export function useUnreadCount(): number {
  const { data } = useNotifications();
  return data?.filter((n) => !n.read).length ?? 0;
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.patch<NotificationDto>(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiClient.post<{ success: boolean }>('/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: notificationKeys.preferences,
    queryFn: async (): Promise<NotificationPreferences> => {
      const data = await apiClient.get<NotificationPreferencesDto>('/notification-preferences');
      return mapPreferences(data);
    },
  });
}

export function useSaveNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (prefs: NotificationPreferences) =>
      apiClient.post<NotificationPreferencesDto>('/notification-preferences', {
        body: preferencesToDto(prefs),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.preferences });
    },
  });
}
