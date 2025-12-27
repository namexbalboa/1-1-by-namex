import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Dashboard } from '@/pages/Dashboard';
import { Collaborators } from '@/pages/Collaborators';
import { CollaboratorForm } from '@/pages/CollaboratorForm';
import { CollaboratorDetails } from '@/pages/CollaboratorDetails';
import { Settings } from '@/pages/Settings';
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
            path="/collaborators"
            element={
              <PrivateRoute>
                <Collaborators />
              </PrivateRoute>
            }
          />
          <Route
            path="/collaborators/new"
            element={
              <PrivateRoute>
                <CollaboratorForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/collaborators/:id"
            element={
              <PrivateRoute>
                <CollaboratorDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/collaborators/:id/edit"
            element={
              <PrivateRoute>
                <CollaboratorForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
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
