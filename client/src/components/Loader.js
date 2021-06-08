import React from "react";
import "../styles/Loader.css";

export default function Loader({ message }) {
  return (
    <div className="darkBackground">
      <div className="loader">{message}</div>
    </div>
  );
}
