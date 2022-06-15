import React from "react";
import { pawnsdata } from "./data";
import Pawns from "./Pawns";
import { useState } from "react";

function EscaperSide() {
  const [pawns, setPawns] = useState(pawnsdata);
  return (
    <div>
      <Pawns pawns={pawns} />
    </div>
  );
}

export default EscaperSide;
