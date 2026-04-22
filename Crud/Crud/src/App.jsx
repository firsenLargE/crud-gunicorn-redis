import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Categories from "./Categories";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  if (localStorage.getItem("access_token") && !isLoggedIn) { 
    setIsLoggedIn(true);
  }

  return (
    <Router>
      <Routes>
        {/* Initial login page */}
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />

        {/* Protected route */}
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Redirect default route to login */}
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/categories" element={<Categories />} />
      </Routes>
    </Router>
  );
}

export default App;