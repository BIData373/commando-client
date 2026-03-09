import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { EnvironmentPage } from '@/pages/EnvironmentPage';
import { InstructionPage } from '@/pages/InstructionPage';
import { PersonalAreaPage } from '@/pages/PersonalAreaPage';
import { EnvironmentSettingsPage } from '@/pages/EnvironmentSettingsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/env/:envId" element={<EnvironmentPage />} />
        <Route
          path="/env/:envId/i/:instructionId"
          element={<InstructionPage />}
        />
        <Route path="/personal" element={<PersonalAreaPage />} />
        <Route
          path="/env/:envId/settings"
          element={<EnvironmentSettingsPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
