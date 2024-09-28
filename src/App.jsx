import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import WelcomePage from "./components/WelcomePage";

const App = () => {
  return (
    <div
      className="h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('path_to_your_image.jpg')" }}
    >
      <Router>
        <Header />
        <br />
        <div className="p-4 bg-white bg-opacity-80 rounded-lg">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/guest" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<WelcomePage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
};



export default App;
