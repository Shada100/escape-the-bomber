import React from "react";
import { useState } from "react";
import "./GameLanding.css";

function GameLanding({ bomberStart, escaperStart }) {
  const bom = () => {
    bomberStart();
  };

  const escap = () => {
    escaperStart();
  };
  // const startGame = () => {
  //   SetIsStartGame(true);
  // };

  // const beEscaper = () => {
  //   setEscaper("shada");
  //   startGame();
  //   setBomber("Jasper");
  // };
  // const beBomber = () => {
  //   setEscaper("shada");
  //   startGame();
  //   setBomber("Jasper");
  // };
  return (
    <>
      <div className="gamehome">
        <div className="wrapper">
          <h1 className="choicetext">Make A Choice</h1>
          <div className="container">
            <img
              src="/PlayersPng/boom.png"
              alt="Bomber"
              onClick={bom}
              className="bom"
            />
            <img
              src="/PlayersPng/react-pawn.png"
              alt="Pawn"
              onClick={escap}
              className="esc"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default GameLanding;
