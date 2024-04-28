import React, { useState } from "react";

export default function Content({ title, content }) {
  const style = {
    WebkitLineClamp: 4,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    display: "-webkit-box",
  };
  const [isReadLess, setIsReadLess] = useState(true);
  return (
    <div className="paste-content">
      <h3 className="paste-title">{title}</h3>
      <p style={isReadLess ? style : {}}>{content}</p>
      <p
        className="paste-button"
        onClick={() => setIsReadLess(!isReadLess)}
      >{`Read ${isReadLess ? "more" : "less"}`}</p>
    </div>
  );
}
