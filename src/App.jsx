import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Toasts from './components/Toasts';
import { JobProvider } from './context/JobContext';
import About from './pages/About';
import Companies from './pages/Companies';
import CompanyDetails from './pages/CompanyDetails';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import JobDetails from './pages/JobDetails';
import Jobs from './pages/Jobs';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import SavedJobs from './pages/SavedJobs';
import Signup from './pages/Signup';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }, [pathname]);
  return null;
}

function NavigationProgress() {
  const { pathname } = useLocation();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const timer = setTimeout(() => setActive(false), 550);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!active) return null;
  return <div className="fixed left-0 top-0 z-[80] h-0.5 w-full origin-left animate-progress bg-lime" />;
}

function Shell() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-lg focus:bg-lime focus:px-3 focus:py-2 focus:text-forest-deep"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <NavigationProgress />
      <Navbar />
      <main id="main" className="flex-1 scroll-mt-24 pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:jobId" element={<JobDetails />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:companyId" element={<CompanyDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/saved" element={<SavedJobs />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toasts />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <JobProvider>
        <Shell />
      </JobProvider>
    </BrowserRouter>
  );
}
