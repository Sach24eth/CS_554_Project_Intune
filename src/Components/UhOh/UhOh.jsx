import React, { useEffect } from "react";
import "./uhoh.css";

const UhOh = () => {
  useEffect(() => {
    const lotteDiv = document.getElementById("gif");
    const lottePlayer = document.createElement("lottie-player");
    lottePlayer.src =
      "https://assets1.lottiefiles.com/packages/lf20_u1xuufn3.json";
    lottePlayer.style.background = "transparent";
    lottePlayer.style.width = "300px";
    lottePlayer.style.height = "300px";
    lottePlayer.loop = true;
    lottePlayer.speed = "1";
    lottePlayer.autoplay = true;
    lotteDiv.appendChild(lottePlayer);
  }, []);
  return (
    <section id="ohno">
      <div className="container">
        <div id="gif" />
        <h1 className="heading">Uh Oh!</h1>
        <div className="not-found">Looks like we don't have it :(</div>
      </div>
    </section>
  );
};

export default UhOh;
