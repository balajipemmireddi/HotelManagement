import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// ── Pages ──────────────────────────────────────────────
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashBoard from "./pages/DashBoard";
import AdminDashboard from "./pages/AdminDashboard";

// ── Phase 2 ──
import HotelListPage from "./pages/HotelListPage";

// ── Phase 4+ stubs (will be replaced as phases complete) ──
// import HotelDetailsPage from "./pages/HotelDetailsPage";
// import BookingPage from "./pages/BookingPage";
// import BookingConfirmPage from "./pages/BookingConfirmPage";

// Temporary stub component for routes not yet implemented
function ComingSoon({ page }) {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <div className="text-center text-muted">
        <div style={{ fontSize: "3rem" }}>🚧</div>
        <h4 className="mt-3">{page}</h4>
        <p>This page is coming in a future phase.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* ── Public Routes ── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* ── Phase 2: Hotel Listing ── */}
          <Route path="/hotels" element={<HotelListPage />} />

          {/* ── Phase 4: Hotel Details ── */}
          <Route path="/hotels/:id" element={<ComingSoon page="Hotel Details" />} />

          {/* ── Phase 6-7: Booking Flow ── */}
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <ComingSoon page="Booking" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/confirm"
            element={
              <ProtectedRoute>
                <ComingSoon page="Booking Confirmation" />
              </ProtectedRoute>
            }
          />

          {/* ── Phase 8: User Dashboard & Booking History ── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashBoard />
              </ProtectedRoute>
            }
          />

          {/* ── Phase 11: Admin Panel ── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ── 404 Fallback ── */}
          <Route
            path="*"
            element={
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                <div className="text-center text-muted">
                  <div style={{ fontSize: "3rem" }}>404</div>
                  <h4 className="mt-3">Page Not Found</h4>
                  <p>The page you're looking for doesn't exist.</p>
                </div>
              </div>
            }
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
