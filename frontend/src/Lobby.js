import { useEffect, useState } from "react";
import "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js";
import Navbar from "./navbar/Navbar";
import { ChakraProvider } from "@chakra-ui/react";
import { ethers } from "ethers";
// import { useEthers } from "@usedapp/core";

function Lobby({
  joinGame,
  newGame,
  gameCodeDisplay,
  account,
  connectWalletHandler,
  errorMessage,
}) {
  const [gameCode, setGameCode] = useState("");

  const connect = () => {
    connectWalletHandler();
  };

  // useEffect(() => {
  //   if (window.ethereum) {
  //     window.ethereum
  //       .request({ method: "eth_requestAccounts" })
  //       .then((result) => {
  //         setAccount(result[0]);
  //       });
  //   }
  // }, []);
  // // const { account } = useEthers();
  // const { ethereum } = window;
  // if (ethereum) {
  //   var provider = new ethers.providers.Web3Provider(ethereum);
  // }

  // const isMetaMaskaccount = async () => {
  //   const accounts = await provider.listAccounts();
  //   return accounts.length > 0;
  // };
  // useEffect(() => {
  //   if (isMetaMaskaccount()) {
  //     setaccount(true);
  //   } else if (!isMetaMaskaccount()) {
  //     setaccount(false);
  //   }
  // }, [isMetaMaskaccount]);

  const handleChange = (e) => {
    setGameCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    join(gameCode);
    setGameCode("");
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
      <ChakraProvider>
        <header>
          <Navbar account={account} connect={connect} />
        </header>
        {account ? (
          <main className="vh-100">
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
          </main>
        ) : (
          <div>
            <h1>Please connect to a wallet</h1>
            <h3>{errorMessage}</h3>
          </div>
        )}
      </ChakraProvider>
    </div>
  );
}

export default Lobby;
