import type { ReactNode } from 'react';
import { useState } from 'react';
import { BrowserRouter, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { BottomNav } from './components/layout/BottomNav';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AdminListingsPage } from './pages/AdminListingsPage';
import { BookingPage } from './pages/BookingPage';
import { BookingSuccessPage } from './pages/BookingSuccessPage';
import { HomePage } from './pages/HomePage';
import { HostApplyPage } from './pages/HostApplyPage';
import { HostDashboardPage } from './pages/HostDashboardPage';
import { HostPage } from './pages/HostPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { RoomDetailsPage } from './pages/RoomDetailsPage';
import { SearchPage } from './pages/SearchPage';
import { WalletPage } from './pages/WalletPage';
import { WelcomeScreen } from './pages/WelcomeScreen';

const WELCOME_SESSION_KEY = 'rero_welcome_shown';

function hasSeenWelcome(): boolean {
  try {
    return sessionStorage.getItem(WELCOME_SESSION_KEY) === '1';
  } catch {
    return true; // storage unavailable — don't block the app on it
  }
}

function TabShell() {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#FAFAFA] pb-20">
      <Outlet />
      <BottomNav />
    </div>
  );
}

function FullScreen({ children }: { children: ReactNode }) {
  return <div className="mx-auto min-h-screen max-w-md bg-[#FAFAFA]">{children}</div>;
}

function AppShell() {
  const [showWelcome, setShowWelcome] = useState(() => !hasSeenWelcome());
  const navigate = useNavigate();

  if (showWelcome) {
    return (
      <WelcomeScreen
        onEnter={() => {
          try {
            sessionStorage.setItem(WELCOME_SESSION_KEY, '1');
          } catch {
            // ignore — worst case it shows again next load this session
          }
          setShowWelcome(false);
          navigate('/');
        }}
      />
    );
  }

  return (
    <Routes>
      <Route element={<TabShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/bookings" element={<MyBookingsPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route
        path="/rooms/:id"
        element={
          <FullScreen>
            <RoomDetailsPage />
          </FullScreen>
        }
      />
      <Route
        path="/booking/:roomId"
        element={
          <FullScreen>
            <BookingPage />
          </FullScreen>
        }
      />
      <Route
        path="/booking/success"
        element={
          <FullScreen>
            <BookingSuccessPage />
          </FullScreen>
        }
      />
      <Route
        path="/host"
        element={
          <FullScreen>
            <HostPage />
          </FullScreen>
        }
      />
      <Route
        path="/host/apply"
        element={
          <FullScreen>
            <HostApplyPage />
          </FullScreen>
        }
      />
      <Route
        path="/host/dashboard"
        element={
          <FullScreen>
            <HostDashboardPage />
          </FullScreen>
        }
      />
      <Route
        path="/admin"
        element={
          <FullScreen>
            <AdminListingsPage />
          </FullScreen>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
