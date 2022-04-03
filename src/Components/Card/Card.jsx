import React from "react";
import "./card.css";
const Card = ({ heading, image, clickHandler, uri, albumId, albumRedir }) => {
  return (
    <div
      id={uri}
      className="card"
      onClick={albumId ? albumRedir : clickHandler}
    >
      <div className="img">
        <img src={image} alt={heading} />
      </div>
      <p className="heading">{heading}</p>
    </div>
  );
};

export default Card;
