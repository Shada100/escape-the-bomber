import "./Board.css";
import Box from "./Box";

const Board = ({ escapePawn, bomberBomb, bombSet }) => {
  const xComponent = ["0", "1", "2", "3", "4", "5"];
  const yComponent = ["0", "1", "2", "3", "4", "5"];
  return (
    <div id="chessboard">
      {xComponent.map((x) =>
        yComponent.map((y) => (
          <div className="spot" key={[x, y]}>
            <Box
              escapePawn={escapePawn}
              bomberBomb={bomberBomb}
              bombSet={bombSet}
              coordinate={[x, y]}
            />
          </div>
        ))
      )}
      {/*<img src="" alt="" />*/}
    </div>
  );
};

export default Board;
