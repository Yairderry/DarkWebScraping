import React from "react";
import "../styles/Error.css";

export default function ErrorDisplay({ message }) {
  return (
    <div className="error">
      <div>
        <p>{message}</p>
        <button>Go Back</button>
      </div>
    </div>
  );
}
