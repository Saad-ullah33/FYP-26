import React from 'react';
import {  MantineProvider } from '@mantine/core';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Smartbuild from './Pages/Smartbuild';
import Header from './components/Header/Header';
import Footer from './components/Footer';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import AddProperty from './PostProperty/AddProperty';
import { NewProject } from './ExploreTools/NewProject';

function App() {

  return (
    <div >
      
   <MantineProvider >
    <BrowserRouter>
    <Header/>

    <Routes>
      <Route path='*' element={<HomePage/>} />
      <Route path='/Smart-build' element={<Smartbuild/>} />
      <Route path='/add-property' element={<AddProperty/>} />
      <Route path='/new-project' element={<NewProject/>} />
    </Routes>
    <Footer/>
     </BrowserRouter>
    </MantineProvider>



    </div>
  );
}

export default App;
