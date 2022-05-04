import React, { useState } from "react";
import Welcome from "./Welcome/welcome";
import "./space.css";
import Spaceship from "./Spaceship";
const Space = () => {
  const [spaceCreated, setSpaceCreated] = useState(false);

  const created = () => {
    setSpaceCreated(true);
  };
  return (
    <section id="space">
      {!spaceCreated && <Welcome className="container" onCreated={created} />}
      {spaceCreated && <Spaceship />}
      {/* <div>Test</div> */}
    </section>
  );
};

export default Space;
