import "./App.css";
import { useEffect, useState } from "react";
import GameLanding from "./GameLanding";
import Board from "./Board";
import BombersSide from "./BombersSide";
import EscaperSide from "./EscaperSide";
import io from "socket.io-client";
import Lobby from "./Lobby";
import GameEnding from "./GameEnding";
import WalletConnectB from "./navbar/WalletConnectB";
import { ethers } from "ethers";
import { Toaster } from "react-hot-toast";
const socket = io.connect("http://localhost:3001");

function App() {
  const [gameCodeDisplay, setGameCodeDisplay] = useState("");
  const [lobbyPass, setLobbyPass] = useState(true);
  const [isBomber, setIsBomber] = useState(false);
  const [gameRoom, setGameRoom] = useState("");
  let coordinate = { x: "", y: "" };
  const [escapePawn, setEscapePawn] = useState(coordinate);
  const [bomberBomb, setBomberBomb] = useState(coordinate);
  const [bombSet, setBombSet] = useState([]);
  const [bomberCanSet, setBomberCanSet] = useState(false);
  const [escaperCanSet, setEscaperCanSet] = useState(true);
  const [victory, setVictory] = useState("");
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [account, setAccount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [provider, setProvider] = useState("");
  const [signer, setSigner] = useState("");
  const [contract, setContract] = useState("");
  const [notification, setNotification] = useState("");
  const contractAddress = "0x8d12a197cb00d4747a1fe03395095ce2a5cc6819";

  const connectWalletHandler = () => {
    if (window.ethereum) {
      setErrorMessage("");
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangeHandler(result[0]);
        });
    } else {
      setErrorMessage("Please install MetaMask");
    }
  };

  const accountChangeHandler = (newAccount) => {
    setAccount(newAccount);
    updateEthers();
    // setErrorMessage("");
  };

  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);
    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);
    let tempContract = new ethers.Contract(
      contractAddress,
      //BombEscaper_abi,
      tempSigner
    );
    setContract(tempContract);
  };

  const joinGame = async (gameCode) => {
    // call contract function to join game
    try {
      await contract.joinGame(gameCode);
    } catch (error) {
      console.log(error);
    }
  };

  const newGame = async () => {
    // call the contract to create a new game
    try {
      await contract.newGame();
    } catch (error) {
      console.log(error);
    }
  };

  //todo
  //On Receiving the new game event from the contract{
  // if account = msg.sender
  // setIsBomber(false);
  //setGameCodeDisplay(lastBattleId from contract)
  //setGameRoom(gameCodeDisplay);
  //socket.emit("newGame", gameRoom);
  //}

  //todo
  //On receiving the join game event from the contract{
  // if account = msg.sender
  //setGameRoom(gameCode);
  //setIsBomber(true);
  //socket.emit("joinGame", gameRoom, true);
  //}

  useEffect(() => {
    if (bomberBomb.x === "" && bomberBomb.y === "") {
      socket.on("receive_bomber_bomb", (bomberBomb) => {
        setBomberBomb(bomberBomb);
        setBombSet([...bombSet, bomberBomb]);
        if (bomberBomb.x === escapePawn.x && bomberBomb.y === escapePawn.y) {
          setIsGameEnded(true);
          setVictory("you lost");
          // bomber must also get it the game ending
        }
      });
    }
  });

  // game ending
  //     setVictory("You Lost");
  //     setIsGameEnded(true);

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
    if (bombSet.length <= 5) {
      setBomberBomb(coordinate);
      setBombSet([...bombSet, coordinate]);
      setBomberCanSet(false);
      socket.emit("send_bomber_bomb", bomberBomb, isBomber, gameRoom);
    }
  };

  const bomberCanPlay = () => {
    socket.emit("bomberCanPlay", isBomber, gameRoom);
  };

  useEffect(() => {
    socket.on("total_clients", (totalClients) => {
      if (totalClients === 2) {
        setLobbyPass(true);
      }
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
    socket.on("bomberCanPlay", (isBomber) => {
      setBomberCanSet(true);
    });
  });

  useEffect(() => {
    socket.on("fullGame", () => {
      setGameCodeDisplay("");
      setGameRoom("");
      alert("Game is already in progress");
    });
  });
  //, [socket]);

  // useEffect(() => {
  //   if (escapePawn.x !== "" && escapePawn.y !== "") {
  //     setBomberCanSet(true);
  //     setEscaperCanSet(false);
  //   }
  // }, [escapePawn]);

  // useEffect(() => {
  //   if (bomberBomb.x !== "" && bomberBomb.y !== "") {
  //     setBomberCanSet(false);
  //   }
  // }, [bomberBomb]);

  return (
    <div className="App">
      {isGameEnded ? (
        <GameEnding victory={victory} />
      ) : (
        <div>
          {lobbyPass ? (
            <div>
              <div className="bigCon">
                <div className="mainboard">
                  <Board
                    escapePawn={escapePawn}
                    bomberBomb={bomberBomb}
                    bombSet={bombSet}
                  />
                </div>

                <div className="playercon">
                  <div className="scoreboard">
                    <header>
                      <WalletConnectB account={account} />
                    </header>
                    <div className="displayscores">
                      <div className="p1">
                        <span className="ttl">
                          {6 - bombSet.length} Trials Left
                        </span>
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
                        bomberBomb={bomberBomb}
                        bomberCanPlay={bomberCanPlay}
                        account={account}
                        escaperToApp={escaperToApp}
                        escaperCanSet={escaperCanSet}
                        contractAddress={contractAddress}
                        gameRoom={gameRoom}
                        contract={contract}
                      />
                    )}
                  </section>
                </div>
              </div>
            </div>
          ) : (
            <Lobby
              gameCodeDisplay={gameCodeDisplay}
              joinGame={joinGame}
              newGame={newGame}
              account={account}
              errorMessage={errorMessage}
              connectWalletHandler={connectWalletHandler}
            />
          )}
        </div>
      )}
      <Toaster />
    </div>
  );
}

export default App;
