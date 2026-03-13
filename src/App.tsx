import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import EnvironmentPage from './pages/EnvironmentPage';
import EnvironmentSettingsPage from './pages/EnvironmentSettingsPage';
import HomePage from './pages/HomePage';
import PersonalAreaPage from './pages/PersonalAreaPage';
import ToastProvider from './providers/ToastProvider';
import { queryClient } from './queryClient';

// FIX Add sso
function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="env/:envId">
                  <Route index element={<EnvironmentPage />} />

                  {/* // FIX Remove instructions folder? */}
                  {/* <Route path="i/:instructionId" element={<InstructionPage />} /> */}

                  <Route path="settings" element={<EnvironmentSettingsPage />} />
                </Route>

                <Route path="personal" element={<PersonalAreaPage />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </ToastProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;
