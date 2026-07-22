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


import { useAuth } from "./context/AuthContext";
import {
  getAccessToken,
  isTokenExpired,
  clearAuth
} from "./utils/auth.js";


import AuthRoute from "./components/AuthRoute";


// Pages
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
import FloorPlanVisualizer from "./Pages/ExploreTools/FloorPlanVisualizer";

import PropertyListing from "./Pages/PropertyListing";
import PropertyDetail from "./Pages/PropertyDetail";

import AuctionListingPage from "./Pages/Auction/AuctionListingPage";
import AuctionDetail from "./Pages/Auction/AuctionDetail";

import Login from "./Pages/auth/Login";
import Signup from "./Pages/auth/Signup";

import DeedVerification from "./Pages/DeedVerification";

import Map from "./Pages/Map/Map";
import PlotDetail from "./Pages/Map/PlotDetail";

import SearchResults from "./Pages/SearchResults";
import ProjectDetail from "./Pages/ProjectDetail";

import PropertyIndex from "./Pages/PropertyIndex";
import AreaGuides from "./Pages/AreaGuides";

import { BlogIndex } from "./Pages/BlogIndex";
import { BlogDetail } from "./Pages/BlogDetail";
import InvestorRadarPage from "./Pages/AIPrediction/InvestorRadarPage.jsx";
import AiPredictionHub from "./Pages/AIPrediction/AiPredictionHub.jsx";
import AIPropertyAssessor from "./components/AIPropertyAssessor";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import UpgradeModal from "./components/subscription/UpgradeModal";
import AIChatbotAssistant from "./components/subscription/AIChatbotAssistant";
import PricingPage from "./Pages/PricingPage";



/*
=================================
AUTO LOGOUT WHEN JWT EXPIRES
=================================
*/

const useAutoLogout = () => {

  const navigate = useNavigate();


  useEffect(() => {


    const interval = setInterval(() => {


      const token = getAccessToken();


      if(token && isTokenExpired(token)){


        clearAuth();


        navigate("/login", {
          replace:true
        });


      }


    },10000);



    return () => clearInterval(interval);



  },[navigate]);

};





/*
=================================
DASHBOARD ROUTE
=================================
*/

const DashboardRoute = () => {
  const {user} = useAuth();

  if(!user){
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const userRole = user.role ? String(user.role).replace(/^ROLE_/, "").toUpperCase() : "";

  if(userRole === "ADMIN"){
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  return <UserDashboard />;
};





/*
=================================
APPLICATION CONTENT
=================================
*/


const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();



  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/signup";



  const hideFooter =
    hideLayout ||
    location.pathname === "/map";



  useAutoLogout();



  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-blue-600 selection:text-white">
      {!hideLayout && <Header />}

      <main className="flex-1 flex flex-col">
        <Routes>


        {/* PUBLIC */}

        <Route
          path="/login"
          element={<Login />}
        />


{/* 1. Public Asset Analytics View */}
                       
                        
                        {/* 2. Premium Analytics Dashboard */}
                        <Route path="/investor/radar" element={<InvestorRadarPage />} />


  {/* <Route path="/ai-prediction" element={<AiPredictionHub />} /> */}


        <Route
          path="/signup"
          element={<Signup />}
        />



        <Route
          path="/"
          element={<HomePage />}
        />


        <Route
          path="/property-finder"
          element={<PropertyFinder />}
        />


        <Route
          path="/property-index"
          element={<PropertyIndex />}
        />


        <Route
          path="/area-guides"
          element={<AreaGuides />}
        />


        <Route
          path="/ai-assessor"
          element={<AIPropertyAssessor />}
        />

        <Route
          path="/tools/floorplan-visualizer"
          element={<FloorPlanVisualizer />}
        />

        <Route
          path="/pricing"
          element={<PricingPage />}
        />



        <Route
          path="/property/:id"
          element={<PropertyDetail />}
        />



        <Route
          path="/project/:id"
          element={<ProjectDetail />}
        />



        <Route
          path="/verify-deed"
          element={<DeedVerification />}
        />



        <Route
          path="/blogs"
          element={<BlogIndex />}
        />


        <Route
          path="/blog/:id"
          element={<BlogDetail />}
        />





        {/* USER DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <AuthRoute>
              <DashboardRoute />
            </AuthRoute>
          }
        />




        {/* SMART BUILD */}


        <Route
          path="/smart-build"
        >

          <Route
            index
            element={<Smartbuild />}
          />


          <Route
            path="calculator-result"
            element={<CalculatorResult />}
          />


        </Route>





        {/* MAP */}


        <Route
          path="/map"
          element={<Map />}
        />



        <Route
          path="/plot-finder"
          element={<Map />}
        />



        <Route
          path="/plot-detail/:colonyId/:plotId"
          element={<PlotDetail />}
        />



        <Route
          path="/search-results"
          element={<SearchResults />}
        />







        {/* AUTH USER */}



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





        {/* AUCTION */}


        <Route
          path="/auction"
          element={<AuctionListingPage />}
        />



        <Route
          path="/auction/:id"
          element={

            <AuthRoute>

              <AuctionDetail />

            </AuthRoute>

          }
        />







        {/* ADMIN */}



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





        {/* NOT FOUND */}


        <Route
          path="*"
          element={

            <div className="text-center mt-20 text-xl font-bold">

              404 - Page Not Found

            </div>

          }
        />



      </Routes>
      </main>

      {!hideFooter && <Footer />}

      <UpgradeModal />
      {user && <AIChatbotAssistant />}
    </div>
  );

};






/*
=================================
MAIN APP
=================================
*/


function App(){


  return (

    <MantineProvider>

      <SubscriptionProvider>

        <BrowserRouter>


          <AppContent />


        </BrowserRouter>

      </SubscriptionProvider>


    </MantineProvider>

  );


}



export default App;