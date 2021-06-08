import "./App.css";
import { useState, useEffect } from "react";
import Pastes from "./components/Pastes";
import Header from "./components/Header";
import ErrorDisplay from "./components/ErrorDisplay";
import Loader from "./components/Loader";

function App() {
  useEffect(() => {}, []);

  return (
    <div className="App">
      <Header />
      <Pastes />
    </div>
  );
}

export default App;
