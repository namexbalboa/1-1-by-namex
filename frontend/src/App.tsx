import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { Toaster } from '@/components/ui/toaster';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Dashboard } from '@/pages/Dashboard';
import { Meetings } from '@/pages/Meetings';
import { Settings } from '@/pages/Settings';
import { History } from '@/pages/History';
import { HistoryDetails } from '@/pages/HistoryDetails';
import { Retrospective } from '@/pages/meeting/Retrospective';
import { Planning } from '@/pages/meeting/Planning';
import '@/lib/i18n';

function AppContent() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/meetings"
            element={
              <PrivateRoute>
                <Meetings />
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
          <Route
            path="/settings"
            element={
              <PrivateRoute requireManager={true}>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute requireManager={true}>
                <History />
              </PrivateRoute>
            }
          />
          <Route
            path="/history/:collaboratorId/:year"
            element={
              <PrivateRoute requireManager={true}>
                <HistoryDetails />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
      <Toaster />
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
