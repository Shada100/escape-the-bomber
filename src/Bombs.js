import React from "react";
import "./Board.css";
function Bombs({ bombs }) {
  return (
    <>
      {bombs.map((bomb) => {
        return <Bomb key={bomb.id} {...bomb} />;
      })}
    </>
  );
}

function Bomb({ id, image, use }) {
  console.log(image.url);
  return (
    <div key={id}>
      <img src={image.url} alt="bomb" className="picz"/>
    </div>
  );
}
export default Bombs;
