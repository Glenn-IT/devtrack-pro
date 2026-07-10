import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Payments from "./pages/Payments";
import Meetings from "./pages/Meetings";
import WeeklyTracker from "./pages/WeeklyTracker";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/weekly-tracker" element={<WeeklyTracker />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
