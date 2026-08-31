import type { ReactNode } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { BottomNav } from './components/layout/BottomNav';
import { TopBar } from './components/layout/TopBar';
import { LanguageProvider } from './context/LanguageContext';
import { BookingPage } from './pages/BookingPage';
import { BookingSuccessPage } from './pages/BookingSuccessPage';
import { HomePage } from './pages/HomePage';
import { HostPage } from './pages/HostPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { RoomDetailsPage } from './pages/RoomDetailsPage';
import { SearchPage } from './pages/SearchPage';
import { WalletPage } from './pages/WalletPage';

function TabShell() {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#FAFAFA] pb-20">
      <TopBar />
      <Outlet />
      <BottomNav />
    </div>
  );
}

function FullScreen({ children }: { children: ReactNode }) {
  return <div className="mx-auto min-h-screen max-w-md bg-[#FAFAFA]">{children}</div>;
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
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
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
