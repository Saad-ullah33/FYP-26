import React from 'react';
import {  MantineProvider } from '@mantine/core';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Header from './components/Header/Header';
import Footer from './components/Footer';

function App() {


 

  return (
    <div >
      
   <MantineProvider >
    <BrowserRouter>
    <Header/>

    <Routes>
      <Route path='*' element={<HomePage/>} />
    </Routes>
    <Footer/>
     </BrowserRouter>
    </MantineProvider>



    </div>
  );
}

export default App;
