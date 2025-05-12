import React from "react";
import { AuthModal } from "./components/Auth_modal/index.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Event from "./pages/Event";

import "./App.css"; 
import "./index.css";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<AuthModal/>} />
          <Route path="/Event" element={<Event/>} />
      </Routes>
    </Router>
  );
};

export default App;
