import { Routes, Route, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LandingPage from "@/pages/LandingPage";
import SignUpPage from "@/pages/auth/SignUpPage";
import LoginPage from "@/pages/auth/LoginPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import HomePage from "@/pages/dashboard/home/HomePage";
import PendingPage from "@/pages/dashboard/bookings/PendingPage";
import CompletedPage from "@/pages/dashboard/bookings/CompletedPage";
import AddServicePage from "@/pages/dashboard/services/AddServicePage";
import OneOnOneCallPage from "@/pages/dashboard/services/OneOnOneCallPage";
import PriorityDmPage from "@/pages/dashboard/services/PriorityDmPage";
import WebinarPage from "@/pages/dashboard/services/WebinarPage";
import NotFound from "@/pages/NotFoundPage";
import { Toaster } from "sonner";
import { Navigate } from "react-router-dom";
import EditServicePage from "./pages/dashboard/services/EditServicePage";
import { setNavigator } from "./lib/navigation";

const App = () => {
  const navigate = useNavigate();
  setNavigator(navigate);
  
  return (
    <>
      <Routes>
        {/* Landing and Authentication Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="bookings">
            <Route index element={<Navigate to="pending" replace />} />
            <Route path="pending" element={<PendingPage />} />
            <Route path="completed" element={<CompletedPage />} />
          </Route>
          <Route path="services">
            <Route index element={<Navigate to="1-1-call" replace />} />
            <Route path="add" element={<AddServicePage />} />
            <Route path="1-1-call" element={<OneOnOneCallPage />} />
            <Route path="priority-dm" element={<PriorityDmPage />} />
            <Route path="webinar" element={<WebinarPage />} />
            <Route path=":serviceType/edit/:id" element={<EditServicePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors position="bottom-right" />
    </>
  );
};

export default App;
