import React from "react";
import "./Board.css";
function Pawns({ openTextBox }) {
  const pawn = {
    id: 1,
    image: { url: "./PlayersPng/react-pawn.png" },
    use: true,
  };

  return (
    <div>
      <div key={pawn.id}>
        <img
          src={pawn.image.url}
          alt="Pawn"
          className="picz"
          onClick={openTextBox}
        />
      </div>
    </div>
  );
}

export default Pawns;
