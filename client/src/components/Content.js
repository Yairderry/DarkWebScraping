import React from "react";

export default function Content({ title, content }) {
  return (
    <div className="paste-content">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}
