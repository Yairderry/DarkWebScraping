import React from "react";
import "../styles/SearchArea.css";

export default function SearchArea({ inputRef, filterPastes }) {
  const labels = [
    "Help",
    "Tech",
    "Guidelines",
    "Corvid",
    "Api",
    "Collapse",
    "Expand",
    "Problem",
    "Login",
    "Tutorial",
    "View Count",
  ];
  return (
    <div className="search-area">
      <input
        ref={inputRef}
        onChange={filterPastes}
        id="search-input"
        name="Search-text"
        placeholder="Filter pastes"
      />
      <div className="dropdown">
        <span className="drop-ntn">Filter By Labels</span>
        <div className="dropdown-content">
          {labels.map((label, i) => (
            <span className="label-filter" key={i} value={label}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
