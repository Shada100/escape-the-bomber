import React from "react";
import "./Board.css";

function Box({ escapePawn, bomberBomb, coordinate, bombSet }) {
  let pawnImage = "./PlayersPng/react-pawn.png";
  let bombImage = "./PlayersPng/Bomb3.png";
  //  if (escapePawn) {
  //    if (escapePawn.x === coordinate[0] && escapePawn.y === coordinate[1]) {
  //      image = "./PlayersPng/react-pawn.png";
  //    }
  //  }

  return (
    <div className="spots">
      <p>
        {coordinate[0]}, {coordinate[1]}
      </p>
      {escapePawn.x === coordinate[0] && escapePawn.y === coordinate[1] && (
        <img
          src={pawnImage}
          alt="pawn"
          style={{ width: "50px", height: "50px" }}
        />
      )}
      {bombSet.map(
        (bomb) =>
          bomb.x === coordinate[0] &&
          bomb.y === coordinate[1] && (
            <img
              src={bombImage}
              alt="bomb"
              style={{ width: "50px", height: "50px" }}
            />
          )
      )}
    </div>
  );
}

export default Box;
