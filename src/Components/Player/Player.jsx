import React from "react";
import {
  FaBackward,
  FaPlay,
  FaForward,
  FaVolumeUp,
  FaHeart,
  FaMicrophone,
  FaExpand,
  FaEllipsisV,
} from "react-icons/fa";
import { BsBroadcast } from "react-icons/bs";

const Player = () => {
  return (
    <>
      <div className="bottom-player">
        <div className="track-img">
          <img
            src="https://i.scdn.co/image/ab67616d00001e02c50ee26def224e163f54ae0c"
            alt="track"
          />
          <div className="track-name">
            <p className="song">Hurricane (Arcano Remix)</p>
            <p className="artistName">
              Cheat Codes, Grey, Tyson Ritter, Arcando
            </p>
          </div>
          <FaHeart className="heart icon" />
        </div>
        <div className="controls">
          <div className="icons">
            <FaBackward className="icon" />
            <FaPlay className="white icon" />
            <FaForward className="icon" />
          </div>
          <div className="slider">
            <p className="time-playing font-sm">0:54</p>
            <p className="slider-control">
              <span className="slider-actual-pointer"></span>
            </p>
            <p className="time-total font-sm">4:00</p>
          </div>
        </div>
        <div className="volume">
          <FaVolumeUp className="icon" />
          <FaMicrophone className="icon" />
          <FaExpand className="icon" />
          <FaEllipsisV className="icon" />
          <BsBroadcast className="icon" />
        </div>
      </div>
      ;
    </>
  );
};

export default Player;
