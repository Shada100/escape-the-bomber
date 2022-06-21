import React from "react";
import "./Board.css";
function Bombs({ openTextBox }) {
  const bomb = { id: 1, image: { url: "./PlayersPng/Bomb3.png" }, use: true };
  return (
    <div>
      <div key={bomb.id}>
        <img
          src={bomb.image.url}
          alt="bomb"
          className="picz"
          onClick={openTextBox}
        />
      </div>
    </div>
  );
}

export default Bombs;
