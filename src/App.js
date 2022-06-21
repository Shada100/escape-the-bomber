import "./App.css";
import { useEffect, useState } from "react";
import GameLanding from "./GameLanding";
import Board from "./Board";
import BombersSide from "./BombersSide";
import EscaperSide from "./EscaperSide";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  // const [player1choice, setPlayer1choice] = useState({ x: "", y: "" });
  //const [player2choice, setPlayer2choice] = useState({ x: "", y: "" });
  const [isBomber, setIsBomber] = useState(false);
  let coordinate = { x: "", y: "" };
  const [escapePawn, setEscapePawn] = useState(coordinate);
  const [bomberBomb, setBomberBomb] = useState(coordinate);
  const [bomberCanSet, setBomberCanSet] = useState(true);
  const [escaperCanSet, setEscaperCanSet] = useState(false);
  // const [Player1, setPlayer1] = useState({
  //   uuid: "",
  //   Address: "",
  //   Bomber : true,
  //   score: 0,
  //  canPlay: true,
  // });
  // const [Player2, setPlayer2] = useState({
  //   uuid: "",
  //   Address: "",
  //   Bomber : false,
  //   score: 0,
  //  canPlay: false,
  // });
  const bomberStart = () => {
    setGameStarted(true);
    setIsBomber(true);
    // setPlayer1({...Player1, [uuid]: new Date().getTime().toString()})
  };
  const escaperStart = () => {
    setGameStarted(true);
    setIsBomber(false);
  };

  const escaperToApp = (escapersCoordinate) => {
    let coordinate = {
      x: escapersCoordinate.xCoordinate,
      y: escapersCoordinate.yCoordinate,
    };
    console.log(coordinate, "main");
    setEscapePawn(coordinate);
  };

  const bomberToApp = (bombersCoordinate) => {
    let coordinate = {
      x: bombersCoordinate.xCoordinate,
      y: bombersCoordinate.yCoordinate,
    };
    console.log(coordinate, "main");
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

  //  if (bomberBomb.x !== "" && bomberBomb.y !== "") {
  //    setTimeout(() => {
  //      setBomberCanSet(false);
  //      setEscaperCanSet(true);
  //    }, 1000);
  //  }
  //
  //  if (escapePawn.x !== "" && escapePawn.y !== "") {
  //    setTimeout(() => {
  //      setEscaperCanSet(false);
  //    }, 1000);
  //  }

  return (
    <div className="App">
      {gameStarted ? (
        <div className="bigCon">
          <div className="mainboard">
            <Board
              escapePawn={escapePawn}
              bomberBomb={bomberBomb}
              //player1choice={player1choice}
              // player2choice={player2choice}
            />
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
        <GameLanding bomberStart={bomberStart} escaperStart={escaperStart} />
      )}
    </div>
  );
}

export default App;
