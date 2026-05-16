import React from 'react';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import AdminDashboard from './Admin/AdminDashboard';
import Smartbuild from './Pages/Smartbuild';
import Header from './components/Header/Header';
import Footer from './components/Footer';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import AddProperty from './PostProperty/AddProperty';
import { NewProject } from './ExploreTools/NewProject';
import PropertyFinder from './Pages/PropertyFinder';
import Auction from './Pages/Auction/Auction';
import { AllProjects } from './ExploreTools/AllProjects';
import PropertyListing from './Pages/PropertyListing';
import PropertyDetail from './Pages/PropertyDetail';

function App() {

  return (
    <div >

      <MantineProvider >
        <BrowserRouter>
          <Header />

          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/property-finder' element={<PropertyFinder />} />
            <Route path='/Smart-build' element={<Smartbuild />} />
            <Route path='/add-property' element={<AddProperty />} />
            <Route path='/new-project' element={<NewProject />} />
            <Route path="/" element={<NewProject />} />
            <Route path="/projects" element={<AllProjects />} />
            <Route path="/properties/type/:type" element={<PropertyListing />} />
            <Route path="/property/:id" element={<PropertyDetail />} />

            <Route path='/admin/dashboard' element={<AdminDashboard />} />
            <Route path='/auction' element={<Auction />} />
            {/* <Route path="/construction-cost" element={<ConstructionCost />} />
  <Route path="/area-guides" element={<AreaGuides />} />
  <Route path="/property-index" element={<PropertyIndex />} />
  <Route path="/plot-finder" element={<PlotFinder />} /> */}


          </Routes>
          <Footer />
        </BrowserRouter>
      </MantineProvider>



    </div>
  );
}

export default App;
