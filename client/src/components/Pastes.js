import React from "react";
import Paste from "./Paste";

import "../styles/Pastes.css";

export default function Pastes({ pastes }) {
  return (
    <div className="pastes">
      {pastes && pastes.map((paste, i) => <Paste key={i} paste={paste} />)}
    </div>
  );
}
