import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { SignInPrompt } from '../components/auth/SignInPrompt.jsx';
import { isClerkConfigured } from '../utils/constants.js';

export const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      {isClerkConfigured && <SignInPrompt />}
      <Navbar />
      <main className="flex-1">
        <div key={location.pathname} className="animate-slide-up">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};
