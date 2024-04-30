import React from "react";
import "../styles/SearchArea.css";

export default function SearchArea({
  titleInputRef,
  contentInputRef,
  authorInputRef,
  filterPastes,
  labels,
  toggleLabelsFilter,
}) {
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
        <span className="drop-btn">Filter By Labels</span>
        <div className="dropdown-content">
          {labels.map((label, i) => (
            <span
              className="label-filter checked"
              key={i}
              value={label}
              onClick={toggleLabelsFilter}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
