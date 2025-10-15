import React from "react";
import "./Card.css";

const Card = ({ text, image, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <img src={image} alt={text} />
      <div className="desc">{text}</div>
    </div>
  );
};

export default Card;
