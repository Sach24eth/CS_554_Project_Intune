import React from "react";
import "./card.css";
const Card = ({ heading, image, clickHandler, uri, albumId, albumRedir }) => {
  return (
    <div
      id={uri}
      className="card"
      onClick={albumId ? albumRedir : clickHandler}
    >
      <div className="img" id={uri}>
        <img src={image} alt={heading} id={uri} />
      </div>
      <p className="heading" id={uri}>
        {heading}
      </p>
    </div>
  );
};

export default Card;
