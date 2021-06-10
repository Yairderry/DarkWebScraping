import React from "react";
import Label from "./Label";
import "../styles/Labels.css";

export default function Labels({ PasteLabels }) {
  return (
    <span className="labels">
      {PasteLabels &&
        PasteLabels.map((label, i) => <Label key={i} label={label} />)}
    </span>
  );
}
