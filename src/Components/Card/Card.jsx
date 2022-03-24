import React from "react";
import "./card.css";
const Card = ({ heading, image, id, clickHandler, uri }) => {
  return (
    <div id={uri} className="card" onClick={clickHandler}>
      <div className="img">
        <img src={image} alt={heading} />
      </div>
      <p className="heading">{heading}</p>
    </div>
  );
};

export default Card;
