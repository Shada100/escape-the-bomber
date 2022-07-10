import Pawns from "./Pawns";
import { useState } from "react";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BigNumber, ethers } from "ethers";
import { buildPoseidon } from "circomlibjs";

//import { useForm } from "react-hook-form";
//import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Socket } from "socket.io-client";

const schema = yup.object().shape({
  xCoordinate: yup.number().min(0).max(5).required(),
  yCoordinate: yup.number().min(0).max(5).required(),
});

async function EscaperSide({
  escaperToApp,
  escaperCanSet,
  bomberBomb,
  gameRoom,
  bomberCanPlay,
  account,
  contractAddress,
  contract,
}) {
  const [salt, setSalt] = useState("");
  const [position, setPosition] = useState("");
  const [isTrue, setIsTrue] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // isOpen is a boolean
  const [xCoordinate, setXCoordinate] = useState(""); // xCoordinate is a number
  const [yCoordinate, setYCoordinate] = useState(""); // yCoordinate is a number
  const [escapePawn, setEscapePawn] = useState({}); // escapePawn position
  const [isCommittedHash, setIsCommittedHash] = useState(false);
  const [solutionHash, setSolutionHash] = useState("");
  const canSubmit = escapePawn && salt && solutionHash;

  const poseidon = await buildPoseidon();

  const openTextBox = () => {
    if (isOpen) {
      setIsOpen(false);
    } else if (!isOpen && !isTrue && escaperCanSet) {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    setSalt(ethers.BigNumber.from(ethers.utils.randomBytes(32)));
  }, []);

  const canPlay = () => {
    bomberCanPlay();
  };

  // useEffect(() => {
  const onCommitSolutionHash = async (player) => {
    console.log(`onCommitSolutionHash`);
    //     if (gameRoom === battleId && contract) {
    //       setIsCommittedSolutionHash(true);
    canPlay();
    //       toast.success("SolutionHash committed!");

    //     }
  };
  //event listener from the contract
  //contract?.on("CommitSolutionHash", onCommitSolutionHash);
  //return () => {
  //  contract?.off("CommitSolutionHash", onCommitSolutionHash);
  // };
  //}, [a variable it depends on like contract]);

  const commitSolutionHash = async () => {
    const tx = await contract?.deploy(gameRoom, solutionHash).catch((err) => {
      console.log("error: ", err);
    });
    await tx?.wait().catch((err) => {
      console.log(err);
      toast.error("Error!");
    });
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
      setIsTrue(true);
    } else {
      setIsOpen(false);
      toast.error("Please enter a valid coordinate");
      setXCoordinate("");
      setYCoordinate("");
    }
  };

  const setPawn = (escapePawn) => {
    escaperToApp(escapePawn);
    setIsTrue(false);
    if (canSubmit && !isCommittedHash) {
      commitSolutionHash();
    }
    if (isCommittedHash && bomberBomb && escapePawn && salt && solutionHash) {
      verifyProof();
    }
  };

  const verifyProof = async () => {
    await contract.submitProof(
      gameRoom,
      escapePawn.xCoordinate,
      escapePawn.yCoordinate,
      bomberBomb.x,
      bomberBomb.y,
      salt,
      { from: account }
    );
    // should be on a success canPlay();
  };

  const changeSalt = () => {
    setSalt(ethers.BigNumber.from(ethers.utils.randomBytes(32)));
  };

  useEffect(() => {
    if (
      salt &&
      escapePawn.xCoordinate &&
      escapePawn.yCoordinate &&
      !isCommittedHash &&
      !solutionHash
    ) {
      const solutionHash = ethers.BigNumber.from(
        poseidon.F.toObject(
          poseidon([salt, escapePawn.xCoordinate, escapePawn.yCoordinate])
        )
      )();
      setSolutionHash(solutionHash);
    } else {
      setSolutionHash(null);
    }
  }, [salt, escapePawn]);

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  return (
    <div>
      {!isCommittedHash && (
        <div className="ttl">
          <button className="btn" onClick={changeSalt}>
            Change Salt
          </button>
          <p>Salt is {truncate(salt.toString(), 12)}</p>
          <br />
          <br />
        </div>
      )}

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

          {isTrue && (
            <button
              className="btn"
              onClick={() => {
                setPawn(escapePawn);
              }}
            >
              {isCommittedHash ? "Verify proof" : "Commit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EscaperSide;
