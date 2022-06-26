import "./App.css";
import { useEffect, useState } from "react";
import GameLanding from "./GameLanding";
import Board from "./Board";
import BombersSide from "./BombersSide";
import EscaperSide from "./EscaperSide";
import io from "socket.io-client";
import Lobby from "./Lobby";
const socket = io.connect("http://localhost:3001");

function App() {
  const [gameCodeDisplay, setGameCodeDisplay] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [lobbyPass, setLobbyPass] = useState(false);
  const [isBomber, setIsBomber] = useState(false);
  const [gameRoom, setGameRoom] = useState("");
  let coordinate = { x: "", y: "" };
  const [escapePawn, setEscapePawn] = useState(coordinate);
  const [bomberBomb, setBomberBomb] = useState(coordinate);
  const [bomberCanSet, setBomberCanSet] = useState(true);
  const [escaperCanSet, setEscaperCanSet] = useState(false);
  // const [player, setPlayer] = useState({
  //   Address: "",
  //   BomberScore: 0,
  //   EscaperScore:0,
  // });
  const bomberStart = () => {
    setGameStarted(true);
    setIsBomber(true);
    socket.emit("send_is_bomber", true, gameRoom);
  };
  const escaperStart = () => {
    setGameStarted(true);
    setIsBomber(false);
    socket.emit("send_is_bomber", false, gameRoom);
  };

  const joinGame = (gameCode) => {
    socket.emit("joinGame", gameCode);
    setGameRoom(gameCode);
  };

  const newGame = () => {
    socket.emit("newGame");
  };

  // if (player.BomberScore === 3 && isBomber){
  // console.log ("You won");
  // setGameFinished(true);
  // }else if(player.BomberScore === 3 && !isBomber){
  // console.log("You Lost")
  // setGameFinished(true);
  // }else if (player.EscaperScore === 3 && !isBomber){
  // console.log ("You won");
  // setGameFinished(true);
  // }else if (player.EscaperScore === 3 && isBomber){
  // console.log ("You Lost");
  // setGameFinished(true);}

  if (
    bomberBomb.x !== "" &&
    bomberBomb.y !== "" &&
    isBomber &&
    escapePawn.x === "" &&
    escapePawn.y === ""
  ) {
    socket.emit("send_bomber_bomb", bomberBomb, isBomber, gameRoom);
  }

  if (
    escapePawn.x !== "" &&
    escapePawn.y !== "" &&
    !isBomber &&
    bomberBomb.x !== "" &&
    bomberBomb.y !== ""
  ) {
    socket.emit("send_escape_pawn", escapePawn, isBomber, gameRoom);
  }

  useEffect(() => {
    socket.on("total_clients", (totalClients) => {
      if (totalClients === 2) {
        setLobbyPass(true);
      }
    });
  });
  //, [socket]);

  useEffect(() => {
    socket.on("gameCode", (gameCode) => {
      setGameCodeDisplay(gameCode);
      setGameRoom(gameCode);
    });
  });
  //, [socket]);

  useEffect(() => {
    socket.on("unknownGame", () => {
      setGameCodeDisplay("");
      setGameRoom("");
      alert("Unknown game code");
    });
  });
  //, [socket]);

  useEffect(() => {
    socket.on("fullGame", () => {
      setGameCodeDisplay("");
      setGameRoom("");
      alert("Game is already in progress");
    });
  });
  //, [socket]);

  useEffect(() => {
    if (!gameStarted) {
      socket.on("receive_bomber", (isBomber) => {
        setIsBomber(!isBomber);
        setGameStarted(true);
      });
    }
  });
  // , [socket]);

  useEffect(() => {
    if (bomberBomb.x === "" && bomberBomb.y === "") {
      socket.on("receive_bomber_bomb", (bomberBomb) => {
        setBomberBomb(bomberBomb);
      });
    }
  });
  //, [socket]);

  useEffect(() => {
    if (escapePawn.x === "" && escapePawn.y === "") {
      socket.on("receive_escape_pawn", (escapePawn) => {
        setEscapePawn(escapePawn);
      });
    }
  });
  //, [socket]);

  const escaperToApp = (escapersCoordinate) => {
    let coordinate = {
      x: escapersCoordinate.xCoordinate,
      y: escapersCoordinate.yCoordinate,
    };
    setEscapePawn(coordinate);
  };

  const bomberToApp = (bombersCoordinate) => {
    let coordinate = {
      x: bombersCoordinate.xCoordinate,
      y: bombersCoordinate.yCoordinate,
    };
    setBomberBomb(coordinate);
  };

  useEffect(() => {
    if (bomberBomb.x !== "" && bomberBomb.y !== "") {
      setBomberCanSet(false);
      setEscaperCanSet(true);
    }
  }, [bomberBomb]);

  useEffect(() => {
    if (escapePawn.x !== "" && escapePawn.y !== "") {
      setEscaperCanSet(false);
    }
  }, [escapePawn]);

  return (
    <div className="App">
      {lobbyPass ? (
        <div>
          {gameStarted ? (
            <div className="bigCon">
              <div className="mainboard">
                <Board escapePawn={escapePawn} bomberBomb={bomberBomb} />
              </div>

              <div className="playercon">
                <div className="scoreboard">
                  <header className="titlescores">Scores</header>
                  <div className="displayscores">
                    <div className="p1">
                      <span className="ttl">Escaper</span>
                      <span className="biggie">0</span>
                    </div>
                    <div className="p2">
                      <span className="ttl">Bomber</span>
                      <span className="biggie">0</span>
                    </div>
                  </div>
                </div>
                <section className="player">
                  {isBomber ? (
                    <BombersSide
                      bomberToApp={bomberToApp}
                      bomberCanSet={bomberCanSet}
                    />
                  ) : (
                    <EscaperSide
                      escaperToApp={escaperToApp}
                      escaperCanSet={escaperCanSet}
                    />
                  )}
                </section>
              </div>
            </div>
          ) : (
            <GameLanding
              bomberStart={bomberStart}
              escaperStart={escaperStart}
            />
          )}
        </div>
      ) : (
        <Lobby
          joinGame={joinGame}
          newGame={newGame}
          gameCodeDisplay={gameCodeDisplay}
        />
      )}
    </div>
  );
}

export default App;
