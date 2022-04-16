import React from "react";
import "./picker.css";

const Picker = (props) => {
  return (
    <div
      className="bubbles"
      onClick={props.selected}
      name={props.data}
      style={{ animationDelay: props.delay }}
    >
      {props.data}
    </div>
  );
};

export default Picker;
