import React from "react";
import "./Board.css";
function Pawns({ pawns }) {
  return (
    <div>
      {pawns.map((pawn) => {
        return <Pawn key={pawn.id} {...pawn} />;
      })}
    </div>
  );
}

function Pawn({ id, image, use }) {
  return (
    <div key={id}>
      <img src={image.url}  alt="Pawn" className="picz"/>
    </div>
  );
}

export default Pawns;
