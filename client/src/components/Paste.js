import React from "react";
import Content from "./Content";
import Info from "./Info";

import "../styles/Paste.css";

export default function Paste({ paste }) {
  const { title, content, author, date, PasteLabels, site } = paste;
  return (
    <div className="paste">
      <Content title={title} content={content} />
      <Info author={author} date={date} site={site} PasteLabels={PasteLabels} />
    </div>
  );
}
