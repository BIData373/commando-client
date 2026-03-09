import { Outlet } from 'react-router-dom';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <main className="w-full min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
