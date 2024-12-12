import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LayoutComponent from "./components/Layout";
import Login from "./components/Login";
import Registration from "./components/Registration";
import CreateThread from "./components/CreateThread";

const App = () => {
  return (
    <Router>
      <LayoutComponent>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/create-thread" element={<CreateThread />} />
        </Routes>
      </LayoutComponent>
    </Router>

  );
};

export default App;
