import { useState } from 'react'
import Home from './pages/Home'
import AdminPage from './pages/Admin'
import Gallery from './pages/Gallery'

import { Routes,Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'


function App() {
  
  return (
    <div >
      <Navbar />
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path='/showcase' element={<Gallery />} />
      </Routes>
      <Footer />
    </div>
    
  )
}

export default App


