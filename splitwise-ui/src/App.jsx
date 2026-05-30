import { useState } from 'react'
import AuthLayout from './authLayout'
import HomePage from './pages/home'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path="/*" element={<AuthLayout  />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </>
  )
}

export default App
