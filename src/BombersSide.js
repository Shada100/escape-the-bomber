import React from "react";
import Bombs from "./Bombs";
import { bombsdata } from "./data";
import { useState } from "react";

function BombersSide() {
  const [bombs, setBombs] = useState(bombsdata);
  return (
    <div>
      <Bombs bombs={bombs} />
    </div>
  );
}

export default BombersSide;
