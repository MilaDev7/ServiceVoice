import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import FeedbackPrompt from '../features/chat/components/FeedbackPrompt';
import { useMediaQuery } from '../shared/hooks/useMediaQuery';
import { feedbackService } from '../services/feedbackService';

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Auto-close sidebar on desktop resize
  useEffect(() => {
    if (isDesktop) setIsSidebarOpen(false);
  }, [isDesktop]);

  // ─────────────────────────────────────────────
  // Anonymous feedback submission
  // ─────────────────────────────────────────────
  const handleFeedbackSubmit = async (payload) => {
    try {
      await feedbackService.submit({
        content:
          payload.text?.trim() ||
          (payload.audioRecorded
            ? '(voice feedback — transcript pending)'
            : '(no content)'),
        feedbackType: 'other',
        language: 'am',
      });
      console.log('✅ Feedback submitted anonymously');
    } catch (err) {
      // Re-throw so FeedbackPrompt can show the error state
      console.error('❌ Feedback failed:', err);
      throw err;
    }
  };

  return (
    <div className="h-screen flex bg-page-bg">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Feedback modal — accessible from anywhere */}
      <FeedbackPrompt
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
}

export default MainLayout;