import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Retrospective } from '@/pages/meeting/Retrospective';
import { Planning } from '@/pages/meeting/Planning';
import '@/lib/i18n';

function AppContent() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/meeting/:journeyId/:meetingNumber/retrospective"
            element={
              <PrivateRoute>
                <Retrospective />
              </PrivateRoute>
            }
          />
          <Route
            path="/meeting/:journeyId/:meetingNumber/planning"
            element={
              <PrivateRoute>
                <Planning />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <AppContent />
    </Suspense>
  );
}

export default App;
