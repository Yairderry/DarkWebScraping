import React from "react";
import Paste from "./Paste";

import "../styles/Pastes.css";

export default function Pastes({ pastes, labelsFilter }) {
  return (
    <div className="pastes">
      {pastes &&
        pastes
          .filter(({ PasteLabels }) => {
            return (
              PasteLabels.length === 0 ||
              PasteLabels.some((label) => labelsFilter.includes(label))
            );
          })
          .map((paste, i) => <Paste key={i} paste={paste} />)}
    </div>
  );
}
