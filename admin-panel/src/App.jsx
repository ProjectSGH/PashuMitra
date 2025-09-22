import { useEffect, useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import MainDashboard from "./pages/MainDashboardPage"
import LoginPage from "./pages/Login"

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("adminToken")
  )

  // ✅ Function to login
  const handleLogin = (token) => {
    localStorage.setItem("adminToken", token)
    setIsAuthenticated(true) // <- triggers rerender & redirect
  }

  // ✅ Function to logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    setIsAuthenticated(false) // <- triggers rerender & redirect
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <MainDashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  )
}
