import React from "react";
import SearchArea from "./SearchArea";

import "../styles/Header.css";

export default function Header({
  titleInputRef,
  contentInputRef,
  authorInputRef,
  filterPastes,
  labels,
  toggleLabelsFiler,
}) {
  return (
    <header>
      <h1>The World Is F*cked</h1>
      <SearchArea
        authorInputRef={authorInputRef}
        contentInputRef={contentInputRef}
        titleInputRef={titleInputRef}
        filterPastes={filterPastes}
        labels={labels}
        toggleLabelsFiler={toggleLabelsFiler}
      />
    </header>
  );
}
