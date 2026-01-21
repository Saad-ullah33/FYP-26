import React from 'react';
import {  MantineProvider } from '@mantine/core';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Smartbuild from './Pages/Smartbuild';
import Header from './components/Header/Header';
import Footer from './components/Footer';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';

function App() {


 

  return (
    <div >
      
   <MantineProvider >
    <BrowserRouter>
    <Header/>

    <Routes>
      <Route path='*' element={<HomePage/>} />
      <Route path='/Smartbuild' element={<Smartbuild/>} />
    </Routes>
    <Footer/>
     </BrowserRouter>
    </MantineProvider>



    </div>
  );
}

export default App;
