import React from "react";
import SearchArea from "./SearchArea";

import "../styles/Header.css";

export default function Header({ inputRef, filterPastes }) {
  return (
    <header>
      <h1>The World Is F*cked</h1>
      <SearchArea inputRef={inputRef} filterPastes={filterPastes} />
    </header>
  );
}
