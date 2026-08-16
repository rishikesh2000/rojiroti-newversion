import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Jobs from "./pages/Jobs";
import SearchResults from "./pages/SearchResults";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Employer from "./pages/Employer";
import EmployerLogin from "./pages/EmployerLogin";
import Dashboard from "./pages/Dashboard";
import EmployerLayout from "./layouts/EmployerLayout";
import EmployerDashboardHome from "./pages/employer/EmployerDashboardHome";
import EmployerJobs from "./pages/employer/EmployerJobs";
import EmployerDatabase from "./pages/employer/EmployerDatabase";
import EmployerDatabaseSaved from "./pages/employer/EmployerDatabaseSaved";
import EmployerDatabaseUnlocked from "./pages/employer/EmployerDatabaseUnlocked";
import EmployerCredits from "./pages/employer/EmployerCredits";
import EmployerBilling from "./pages/employer/EmployerBilling";
import EmployerProfile from "./pages/employer/EmployerProfile";
import EmployerCompanyProfile from "./pages/employer/EmployerCompanyProfile";
import EmployerPostJob from "./pages/employer/EmployerPostJob";
import EmployerRefer from "./pages/employer/EmployerRefer";
import EmployerJobDetail from "./pages/employer/EmployerJobDetail";
import CandidateDetail from "./pages/employer/CandidateDetail";
import ComingSoonPage from "./pages/ComingSoonPage";
import { useEffect, useState } from "react";
import { getSession, setSession, clearSession, type Role } from "@/lib/session";
// Route-based i18n removed; use Google Translate widget for client-side translation
import useEmployeeStore from "./store/employeeStore";
import useEmployerStore from "./store/employerStore";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-white shadow-soft">Go home</Link>
      </div>
    </div>
  );
}

// Protected route for website pages - redirect employer to dashboard
function WebsiteRoute({ element }: { element: React.ReactNode }) {
  const session = getSession();
  
  if (session && session.role === "employer") {
    return <Navigate to="/employer-dashboard" replace />;
  }
  
  return element;
}

export default function App() {
  const { getEmployee, getSavedJobs } = useEmployeeStore();
  const { getEmployer } = useEmployerStore();
  const location = useLocation();
  const [sessionLoaded, setSessionLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSessionLoaded(true);
      return;
    }

    const session = getSession();
    const fetchUserData = async () => {
      const restoreSession = async (role: Role, profileData: any) => {
        const name = profileData?.name || `${profileData?.first_name ?? ""} ${profileData?.last_name ?? ""}`.trim();
        setSession({
          role,
          name: name || undefined,
          first_name: profileData?.first_name,
          last_name: profileData?.last_name,
          avatar: profileData?.avatar,
        });
      };

      if (!session) {
        try {
          const response = await getEmployee();
          const payload = response?.data?.data ?? response?.data;
          const user = payload?.user ?? payload?.employee ?? payload;
          await restoreSession("employee", user);
          // load saved jobs for employee so job list shows correct saved state
          try { await getSavedJobs(); } catch (e) { /* ignore */ }
        } catch (err) {
          try {
            const response = await getEmployer();
            const payload = response?.data?.data ?? response?.data;
            const employer = payload?.employer ?? payload;
            await restoreSession("employer", employer);
          } catch (innerErr) {
            console.error("Failed to restore session from token:", innerErr);
            localStorage.removeItem("token");
            clearSession();
          }
        }
      } else {
        try {
          if (session.role === "employer") {
            await getEmployer();
          } else {
            await getEmployee();
            // ensure saved jobs are loaded for employee views
            try { await getSavedJobs(); } catch (e) { /* ignore */ }
          }
        } catch (err) {
          console.error("Failed to fetch user data:", err);
        }
      }
      
      setSessionLoaded(true);
    };

    fetchUserData();
  }, [getEmployee, getEmployer]);

  if (!sessionLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 rounded-full border-4 border-slate-200 border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Route-based locale prefixes removed — use plain routes and Google Translate for client-side translation */}
      <Route path="/" element={<WebsiteRoute element={<Landing />} />} />
      <Route path="/jobs" element={<WebsiteRoute element={<Jobs />} />} />
      <Route path="/search/:slug" element={<WebsiteRoute element={<SearchResults />} />} />
      <Route path="/jobs/:jobId" element={<WebsiteRoute element={<JobDetail />} />} />
      <Route path="/login" element={<WebsiteRoute element={<Login />} />} />
      <Route path="/signup" element={<WebsiteRoute element={<Signup />} />} />
      <Route path="/employer" element={<WebsiteRoute element={<Employer />} />} />
      <Route path="/employer-login" element={<EmployerLogin />} />
      <Route path="/about" element={<WebsiteRoute element={<ComingSoonPage title="About" />} />} />
      <Route path="/support" element={<WebsiteRoute element={<ComingSoonPage title="Support" />} />} />
      <Route path="/privacy" element={<WebsiteRoute element={<ComingSoonPage title="Privacy Policy" />} />} />
      <Route path="/terms" element={<WebsiteRoute element={<ComingSoonPage title="Terms & Conditions" />} />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/employer-dashboard" element={<EmployerLayout />}>
        <Route index element={<EmployerDashboardHome />} />
        <Route path="jobs" element={<EmployerJobs />} />
        <Route path="jobs/:jobId" element={<EmployerJobDetail />} />
        <Route path="candidate/:candidateId" element={<CandidateDetail />} />
        <Route path="database" element={<EmployerDatabase />} />
        <Route path="database/saved" element={<EmployerDatabaseSaved />} />
        <Route path="database/unlocked" element={<EmployerDatabaseUnlocked />} />
        <Route path="credits" element={<EmployerCredits />} />
        <Route path="billing" element={<EmployerBilling />} />
        <Route path="profile" element={<EmployerProfile />} />
        <Route path="company-profile" element={<EmployerCompanyProfile />} />
        <Route path="post-job" element={<EmployerPostJob />} />
        <Route path="refer" element={<EmployerRefer />} />
      </Route>

      <Route path="/employer-find" element={<Navigate to="/employer-dashboard/database" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
