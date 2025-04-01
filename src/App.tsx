import React from "react";
// import Home from "./pages/Home";
import Event from "./pages/Event";

import "./App.css"; // Caso queira estilizar o App também
import "./index.css";
const App: React.FC = () => {
  return (
    <div className="app-container">
      <Event />
    </div>
  );
};

export default App;
