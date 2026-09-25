import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ChatPage from '../features/chat/ChatPage';
import ServicesPage from '../features/services/ServicesPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import ProfilePage from '../features/profile/ProfilePage';
import NotFoundPage from '../shared/components/NotFoundPage';

function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<ChatPage />} />
        <Route path="/chat/:sessionId" element={<ChatPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;