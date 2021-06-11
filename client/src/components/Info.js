import React from "react";
import Labels from "./Labels";

export default function Info({ author, date, site, PasteLabels }) {
  return (
    <div className="paste-info">
      <span className="info">
        By: {author} | Site: {site} | Date: {new Date(date).toDateString()}
      </span>
      <Labels PasteLabels={PasteLabels} />
    </div>
  );
}
