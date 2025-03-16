import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import SettingsBar from "./components/SettingsBar"; 
import Home from "./pages/Home"; 
import Login from "./pages/Login"; 
import Register from "./pages/Register"; 
import ProtectedRoutes from "./components/ProtectedRoutes"; 

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterandLogout() {
  localStorage.clear();
  return <Register />;
}





function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" 
        element={
        <ProtectedRoutes>
          <Home />
        </ProtectedRoutes>
      }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterandLogout />} />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App;
