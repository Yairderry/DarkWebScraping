import React from "react";
import "../styles/SearchArea.css";

export default function SearchArea({
  titleInputRef,
  contentInputRef,
  authorInputRef,
  filterPastes,
}) {
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
        ref={authorInputRef}
        onChange={filterPastes}
        id="search-author-input"
        name="Search-text"
        placeholder="Enter author or part of it"
      />
      <input
        ref={contentInputRef}
        onChange={filterPastes}
        id="search-content-input"
        name="Search-text"
        placeholder="Enter content or part of it"
      />
      <input
        ref={titleInputRef}
        onChange={filterPastes}
        id="search-title-input"
        name="Search-text"
        placeholder="Enter title name or part of it"
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
