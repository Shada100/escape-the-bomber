import React, { useEffect, useState } from "react";
import "./Board.css";
import { bombsdata } from "./data";
import Box from "./Box";

const Board = ({ escapePawn, bomberBomb }) => {
  const xComponent = ["0", "1", "2", "3", "4", "5"];
  const yComponent = ["0", "1", "2", "3", "4", "5"];
  return (
    <div id="chessboard">
      {xComponent.map((x) =>
        yComponent.map((y) => (
          <div className="spot" key={[x, y]}>
            <Box
              escapePawn={escapePawn}
              bomberBomb={bomberBomb}
              coordinate={[x, y]}
            />
          </div>
        ))
      )}
      {/*<img src="" alt="" />*/}
    </div>
  );
};

export default Board;
