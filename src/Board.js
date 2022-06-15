import React, { useState } from "react";
import "./Board.css";
import { bombsdata } from "./data";

const Board = (player1choice, player2choice) => {
  // const bombs = [];
  //const pawns = [];
  // pawns.push({image: "./PlayersPng/react-pawn.png" ,x :player2choice.x, y: player2choice.y});
  //bombs.push({image: "./PlayersPng/Bomb3.png" ,x :player1choice.x, y: player1choice.y});
  const [board, setBoard] = useState([]);

  const xComponent = ["0", "1", "2", "3", "4", "5"];
  const yComponent = ["0", "1", "2", "3", "4", "5"];
  for (let i = 0; i < xComponent.length; i++) {
    for (let j = 0; j < yComponent.length; j++) {
      board.push(
        <div className="spot" key={[i, j]}>
          {" "}
          [{xComponent[i]} {yComponent[j]}]{" "}
        </div>
      );
    }
  }
  console.log(board);
  return <div id="chessboard">{board}</div>;
};

export default Board;
