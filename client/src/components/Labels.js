import React from "react";
import Label from "./Label";
import "../styles/Labels.css";

export default function Labels({ labels }) {
  return (
    <span className="labels">
      {labels && labels.map((label, i) => <Label key={i} label={label} />)}
    </span>
  );
}
