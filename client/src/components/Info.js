import React from "react";
import Labels from "./Labels";

export default function Info({ labels, author, date, PasteLabels }) {
  return (
    <div className="paste-info">
      <span className="info">
        By {author} | {new Date(date).toDateString()}
      </span>
      <Labels PasteLabels={PasteLabels} />
    </div>
  );
}
