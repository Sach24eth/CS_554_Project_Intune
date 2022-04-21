import React from "react";

const TextField = (props) => {
  
  return (
    <label>
      <input
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        onChange={props.onChange}
        autoComplete={"current-password"}
        required
      />
    </label>
  );
};

export default TextField;
