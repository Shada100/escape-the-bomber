import Pawns from "./Pawns";
import { useState } from "react";
//import { useForm } from "react-hook-form";
//import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  xCoordinate: yup.number().min(0).max(5).required(),
  yCoordinate: yup.number().min(0).max(5).required(),
});

function EscaperSide({ escaperToApp, escaperCanSet }) {
  const [istrue, setIstrue] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // isOpen is a boolean
  const [xCoordinate, setXCoordinate] = useState(""); // xCoordinate is a number
  const [yCoordinate, setYCoordinate] = useState(""); // yCoordinate is a number
  const [escapePawn, setEscapePawn] = useState({}); // escapePawn position
  const openTextBox = () => {
    if (isOpen) {
      setIsOpen(false);
    } else if (!isOpen && !istrue && escaperCanSet) {
      setIsOpen(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      xCoordinate &&
      yCoordinate &&
      xCoordinate <= 5 &&
      yCoordinate <= 5 &&
      xCoordinate >= 0 &&
      yCoordinate >= 0
    ) {
      const coordinate = { xCoordinate, yCoordinate };
      setEscapePawn(coordinate);
      setXCoordinate("");
      setYCoordinate("");
      setIsOpen(false);
      setIstrue(true);
    } else {
      setIsOpen(false);
      alert("Please enter a valid coordinate");
      setXCoordinate("");
      setYCoordinate("");
    }
  };

  // if (escapePawn.xCoordinate && escapePawn.yCoordinate) {
  //   console.log(escapePawn);
  // }

  const setPawn = (escapePawn) => {
    escaperToApp(escapePawn);
    setIstrue(false);
  };

  return (
    <div>
      <Pawns openTextBox={openTextBox} />
      <div>
        {isOpen && (
          <div className="Form">
            <div>
              <form className="input50" onSubmit={handleSubmit}>
                <input
                  type="number"
                  name="xCoordinate"
                  placeholder="X:"
                  onChange={(e) => {
                    setXCoordinate(e.target.value);
                  }}
                />

                <input
                  type="number"
                  name="yCoordinate"
                  placeholder="Y:"
                  onChange={(e) => {
                    setYCoordinate(e.target.value);
                  }}
                />

                <button type="submit" className="btn">
                  Set coordinate
                </button>
              </form>
            </div>
          </div>
        )}
        {istrue && (
          <button
            className="btn"
            onClick={() => {
              setPawn(escapePawn);
            }}
          >
            Set Pawn
          </button>
        )}
      </div>
    </div>
  );
}

export default EscaperSide;
