import './App.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';

// import Home from './features/Dashboard/Home';

import ProtectedRoute from './layout/ProtectedRoute';
import UnProtectedRoute from './layout/UnProtectedRoute';

import { useCallback, useMemo, useState } from 'react';
import { createAppTheme } from './theme';
import { ThemeProvider } from '@mui/material';
import WelcomePage from './pages/WelcomePage';
import EnterPhoneLoginPage from './pages/EnterPhoneLoginPage';

import EnterPhoneSignupPage from './pages/EnterPhoneSignupPage';

import CommonVerifyOtp from './features/Auth/CommonVerifyOtp';
import SetupProfilePage from './pages/SetupProfilePage';
import AddContactPage from './pages/AddContactPage';
import AddGroupPage from './pages/AddGroupPage';
// import DashboardPage from './pages/DashboardPage';
// import SettingsPage from './pages/SettingsPage';
import ChatScreenPage from './pages/ChatScreenPage';
import Dashboard from './features/Dashboard/Dashboard';
import Settings from './features/Dashboard/Settings';

// import AddContactPage from './pages/AddContactPage';

function App() {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  // useCallback to prevent re-creation on every render
  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // useMemo ensures theme object is stable
  const appTheme = useMemo(() => createAppTheme(themeMode), [themeMode]);
  return (
    <ThemeProvider theme={appTheme}>
      <BrowserRouter>
        <Routes>
          {/* Unprotected routes */}

          <Route
            path="/VerifyOtp"
            element={
              <UnProtectedRoute>
                <CommonVerifyOtp />
              </UnProtectedRoute>
            }
          />
          <Route
            path="/SetupProfile"
            element={
              <UnProtectedRoute>
                <SetupProfilePage />
              </UnProtectedRoute>
            }
          />

          <Route
            path="/Welcome"
            element={
              <UnProtectedRoute>
                <WelcomePage />
              </UnProtectedRoute>
            }
          />
          <Route
            path="/EnterPhoneLogin"
            element={
              <UnProtectedRoute>
                <EnterPhoneLoginPage />
              </UnProtectedRoute>
            }
          />
          <Route
            path="/EnterPhoneSignup"
            element={
              <UnProtectedRoute>
                <EnterPhoneSignupPage />
              </UnProtectedRoute>
            }
          />

          {/* Protected route */}
          {/* <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/AddContact"
            element={
              <ProtectedRoute>
                <AddContactPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AddGroup"
            element={
              <ProtectedRoute>
                <AddGroupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard theme={themeMode} onToggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Setting"
            element={
              <ProtectedRoute>
                <Settings theme={themeMode} onToggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ChatScreen"
            element={
              <ProtectedRoute>
                <ChatScreenPage />
              </ProtectedRoute>
            }
          />

          {/* <Route
            path="/InComingCall"
            element={
              <ProtectedRoute>
                <IncomingCall />
              </ProtectedRoute>
            }
          />
           <Route
            path="/OutGoingCall"
            element={
              <ProtectedRoute>
                <OngoingCall />
              </ProtectedRoute>
            }
          /> */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
