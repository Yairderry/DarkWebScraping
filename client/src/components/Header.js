import React from "react";
import SearchArea from "./SearchArea";

import "../styles/Header.css";

export default function Header({
  titleInputRef,
  contentInputRef,
  authorInputRef,
  filterPastes,
}) {
  return (
    <header>
      <h1>The World Is F*cked</h1>
      <SearchArea
        authorInputRef={authorInputRef}
        contentInputRef={contentInputRef}
        titleInputRef={titleInputRef}
        filterPastes={filterPastes}
      />
    </header>
  );
}
