import { useState } from "react";
import "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js";
function Lobby({ joinGame, newGame, gameCodeDisplay }) {
  const [gameCode, setGameCode] = useState("");

  const handleChange = (e) => {
    setGameCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gameCode.length === 5) {
      join(gameCode);
      setGameCode("");
    } else {
      alert("Please enter a valid game code");
      setGameCode("");
    }
  };

  const join = (gameCode) => {
    joinGame(gameCode);
  };

  const newG = () => {
    if (gameCode === "") {
      newGame();
    }
  };

  return (
    <div>
      <section className="vh-100">
        <div className="container h-100">
          <div id="initialScreen" className="h-100">
            <div className="d-flex flex-column align-items-center justify-content-center h-100">
              <h1>Multiplayer Escape The Bomber</h1>
              <button
                type="submit"
                className="btn btn-success"
                name="newGameButton"
                onClick={newG}
              >
                Create New Game
              </button>
              <div>OR</div>
              <div>
                <input
                  type="text"
                  placeholder="Enter Game Code"
                  value={gameCode}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="btn btn-success"
                name="joinGameButton"
                onClick={handleSubmit}
              >
                Join Game
              </button>
            </div>
          </div>

          <div id="gameScreen" className="h-100">
            <div className="d-flex flex-column align-items-center justify-content-center h-100">
              <h1>
                Your game code is:{" "}
                <span name="gameCodeDisplay">{gameCodeDisplay}</span>
              </h1>

              <canvas id="canvas"></canvas>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Lobby;
