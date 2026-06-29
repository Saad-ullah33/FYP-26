import React, { useEffect } from "react";
import { MantineProvider } from "@mantine/core";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import HomePage from "./Pages/HomePage";
import AdminDashboard from "./Admin/AdminDashboard";
import UserDashboard from "./User/UserDashboard";
import Smartbuild from "./Pages/Smartbuild";
import CalculatorResult from "./SmartBuild/CalculatorResult";
import Header from "./components/Header/Header";
import Footer from "./components/Footer";
import AddProperty from "./PostProperty/AddProperty";
import PropertyFinder from "./Pages/PropertyFinder";
import AllProjects from "./ExploreTools/AllProjects";
import { NewProject } from "./ExploreTools/NewProject";
import PropertyListing from "./Pages/PropertyListing";
import PropertyDetail from "./Pages/PropertyDetail";
import AuctionListingPage from "./Pages/Auction/AuctionListingPage";
import AuctionDetail from "./Pages/Auction/AuctionDetail";
import Login from "./Pages/auth/Login";
import Signup from "./Pages/auth/Signup";
import DeedVerification from "./Pages/DeedVerification";

import { logout } from "./utils/auth";
import Map from "./Pages/Map/Map";
import PlotDetail from "./Pages/Map/PlotDetail";
import SearchResults from "./Pages/SearchResults";

// ==========================
// AUTO LOGOUT HOOK
// ==========================
const useAutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const exp = localStorage.getItem("token_exp");

      if (exp && Date.now() > Number(exp)) {
        logout();
        navigate("/login");
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [navigate]);
};

// ==========================
// AUTH ROUTE
// ==========================
const AuthRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (role && payload.role !== role) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (err) {
    return <Navigate to="/login" replace />;
  }
};

// ==========================
// DYNAMIC DASHBOARD ROUTE REDIRECTOR
// ==========================
const DashboardRoute = () => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <UserDashboard />;
  } catch (err) {
    return <Navigate to="/login" replace />;
  }
};

// ==========================
// APP CONTENT
// ==========================
const AppContent = () => {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  useAutoLogout();

  return (
    <>
      {!hideLayout && <Header />}

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />



        <Route path="/" element={<HomePage />} />
        <Route path="/property-finder" element={<PropertyFinder />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/verify-deed" element={<DeedVerification />} />

        {/* USER + AUTH */}
        <Route
          path="/dashboard"
          element={
            <AuthRoute>
              <DashboardRoute />
            </AuthRoute>
          }
        />

        {/* Smart Build Routes */}
        <Route path="/smart-build">
          <Route index element={<Smartbuild />} />
          <Route path="calculator-result" element={<CalculatorResult />} />
        </Route>
        <Route path="/map">
          <Route index element={<Map />} />
        </Route>
        <Route path="/plot-detail/:colonyId/:plotId" element={<PlotDetail />} />
        <Route path="/search-results" element={<SearchResults />} />

        <Route
          path="/add-property"
          element={
            <AuthRoute role="USER">
              <AddProperty />
            </AuthRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <AuthRoute>
              <AllProjects />
            </AuthRoute>
          }
        />

        <Route
          path="/new-project"
          element={
            <AuthRoute>
              <NewProject />
            </AuthRoute>
          }
        />

        <Route
          path="/auction"
          element={
              <AuctionListingPage />
            // <AuthRoute>
            // </AuthRoute>
          }
        />

        <Route
          path="/auction/:id"
          element={
            <AuthRoute>
              <AuctionDetail />
            </AuthRoute>
          }
        />

        {/* ADMIN ONLY */}
        <Route
          path="/admin/dashboard"
          element={
            <AuthRoute role="ADMIN">
              <AdminDashboard />
            </AuthRoute>
          }
        />

        <Route
          path="/properties/type/:type"
          element={
            <AuthRoute>
              <PropertyListing />
            </AuthRoute>
          }
        />

        {/* 404 ROUTE */}
        <Route
          path="*"
          element={
            <div className="text-center mt-20 text-xl font-bold">
              404 - Page Not Found
            </div>
          }
        />

      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
};

// ==========================
// MAIN APP
// ==========================
function App() {
  return (
    <MantineProvider>
        <AppContent />
    </MantineProvider>
  );
}

export default App;