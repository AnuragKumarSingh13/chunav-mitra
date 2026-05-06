import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { AppRouter } from "./components/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { Login } from "./pages/Login";
import { Registration } from "./pages/Registration";
import { Dashboard } from "./pages/Dashboard";
import { ElectionResults } from "./pages/ElectionResults";
import { WardCandidates } from "./pages/WardCandidates";
import { Premium } from "./pages/Premium";
import { CandidateProfile } from "./pages/CandidateProfile";
import { Slogans } from "./pages/Slogans";
import { AdminPanel } from "./pages/AdminPanel";
import { PosterMaker } from "./pages/PosterMaker";

function AppContent() {
  // Check if user is already logged in with valid data
  const userData = localStorage.getItem('chunavMitraUser');
  
  if (userData) {
    try {
      const parsedUser = JSON.parse(userData);
      // Validate that user data has phone number
      if (parsedUser && parsedUser.phone) {
        // User is logged in, show dashboard
      return (
        <AuthProvider>
          <AppRouter>
            <Routes>
              <Route path="/login" element={<Navigate to="/dashboard" replace />} />
              <Route path="/register" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/results" element={<ElectionResults />} />
              <Route path="/results-2016" element={<ElectionResults />} />
              <Route path="/results-2021" element={<ElectionResults />} />
              <Route path="/poster-maker" element={<PosterMaker />} />
              <Route path="/admin-anurag123" element={<AdminPanel />} />
              <Route path="/" element={<AppShell />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="wards" element={<WardCandidates />} />
                <Route path="premium" element={<Premium />} />
                <Route path="profile" element={<CandidateProfile />} />
                <Route path="slogans" element={<Slogans />} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AppRouter>
        </AuthProvider>
      );
    } else {
        // Invalid user data - go to login
        console.error('Invalid user data - missing phone');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  // User not logged in, show normal flow
  return (
    <AuthProvider>
      <AppRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results" element={<ElectionResults />} />
          <Route path="/results-2016" element={<ElectionResults />} />
          <Route path="/results-2021" element={<ElectionResults />} />
          <Route path="/poster-maker" element={<PosterMaker />} />
          <Route path="/admin-anurag123" element={<AdminPanel />} />
          <Route path="/" element={<AppShell />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="wards" element={<WardCandidates />} />
            <Route path="premium" element={<Premium />} />
            <Route path="profile" element={<CandidateProfile />} />
            <Route path="slogans" element={<Slogans />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppRouter>
    </AuthProvider>
  );
}

export default function App() {
  return <AppContent />;
}
