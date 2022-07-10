import React from "react";
import "./GameEnding.css";

const GameEnding = ({ victory }) => {
  return (
    <section className="Container">
      <div className="GameEndWrapper">
        <div className="Box">
          <div>
            {victory}
            {/* <CloseBtn>X</CloseBtn> */}
            <a href="http://localhost:3000">
              <button className="PlayBtn">Play Again</button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameEnding;
