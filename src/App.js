import "./App.css";
import { useState } from "react";
import GameLanding from "./GameLanding";
import Board from "./Board";
import BombersSide from "./BombersSide";
import EscaperSide from "./EscaperSide";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [player1choice, setPlayer1choice] = useState({ x: "", y: "" });
  const [player2choice, setPlayer2choice] = useState({ x: "", y: "" });
  const [isBomber, setIsBomber] = useState(false);
  // const [Player1, setPlayer1] = useState({
  //   uuid: "",
  //   Address: "",
  //   Bomber : true,
  //   score: 0,
  // });
  // const [Player2, setPlayer2] = useState({
  //   uuid: "",
  //   Address: "",
  //   Bomber : false,
  //   score: 0,
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

  return (
    <div className="App">
      {gameStarted ? (
        <div className="bigCon">
          <div className="mainboard">
            <Board
              player1choice={player1choice}
              player2choice={player2choice}
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
                  <span className="biggie">1</span>
                </div>
              </div>
              <div className="inputsec">
                <div class="enter">
                  <div class="input50">
                    <input type="text" placeholder="X:" />
                  </div>
                  <div class="input50">
                    <input type="text" placeholder="Y:" />
                  </div>
                </div>
                <button className="btn">Click Me</button>
              </div>
            </div>
            <section className="player">
              {isBomber ? <BombersSide /> : <EscaperSide />}
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
