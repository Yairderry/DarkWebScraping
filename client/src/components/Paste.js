import React from "react";
import Content from "./Content";
import Info from "./Info";

import "../styles/Paste.css";

export default function Paste({ paste }) {
  const { title, content, author, date, PasteLabels } = paste;
  return (
    <div className="paste">
      <Content title={title} content={content} />
      <Info author={author} date={date} PasteLabels={PasteLabels} />
    </div>
  );
}
