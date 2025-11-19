import Bishop from "./components/pieces/bishop";
import { useChessBoard, nameIconSet } from "./hooks/useChessBoard";
import { getPiece } from "./components/pieces/drawPiece";

const row = Array(8).fill("");
// const DARK_COLOR = "#739552";
// const LIGHT_COLOR = "#ebecd0";
const DARK_COLOR = "rgb(37,37,37)";
const LIGHT_COLOR = "rgb(135,135,135)";

function App() {
  const { positions, deleted, drawSuggestion, isCheck, winner } =
    useChessBoard();

  return (
    <>
      {isCheck && (
        <div className="text-center p-2 bg-yellow-300 font-bold">CHECK!</div>
      )}
      {winner && (
        <div className="text-center p-2 bg-red-500 text-white font-bold">
          CHECKMATE! {winner.toUpperCase()} WINS!
        </div>
      )}
      <div className="border-1 w-100 p-2 bg-white h-25">
        <span className="text-2xl">Player 2</span>
        <div className="flex">
          {deleted?.map((i) =>
            i.includes("white") ? (
              <img width={30} src={nameIconSet[i]} />
            ) : (
              <></>
            )
          )}
        </div>
      </div>
      <div className="board">
        {row.map((i, idx) => {
          return (
            <div key={idx} className="block flex w-full aspect-[8/1] max-w-150">
              {row.map((j, idxj) => {
                const pieceType = positions[`${idx}${idxj}`];
                return (
                  <div
                    key={idxj}
                    id={`${idx}${idxj}`}
                    onDrop={(ev) => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      let box = ev.target.closest("div");
                      if (
                        positions[box.id]?.target ||
                        positions[box.id]?.name === "point" ||
                        positions[box.id]?.name === "castle"
                      )
                        drawSuggestion(
                          box.id.split("")[0],
                          box.id.split("")[1],
                          positions[
                            `${box.id.split("")[0]}${box.id.split("")[1]}`
                          ]?.name,
                          positions[
                            `${box.id.split("")[0]}${box.id.split("")[1]}`
                          ]?.color
                        );
                    }}
                    onDragStart={() =>
                      drawSuggestion(
                        idx,
                        idxj,
                        pieceType?.name,
                        pieceType?.color
                      )
                    }
                    onClick={() =>
                      drawSuggestion(
                        idx,
                        idxj,
                        pieceType?.name,
                        pieceType?.color
                      )
                    }
                    onDragOver={(ev) => ev.preventDefault()}
                    className="w-[calc(100%/8)] flex justify-center items-center"
                    style={{
                      background:
                        idx % 2 !== idxj % 2 ? DARK_COLOR : LIGHT_COLOR,
                      color: idx % 2 === idxj % 2 ? "black" : "white",
                      boxShadow: pieceType?.target
                        ? "inset 0px 0px 7px 0px red"
                        : "none",
                    }}
                  >
                    {pieceType &&
                    (pieceType?.name === "point" ||
                      pieceType?.name === "castle") ? (
                      <img
                        draggable={
                          pieceType?.name !== "point" &&
                          pieceType?.name !== "castle"
                        }
                        src={
                          nameIconSet[
                            pieceType?.name === "point"
                              ? idx % 2 !== idxj % 2
                                ? "lightPoint"
                                : "darkPoint"
                              : pieceType?.name === "castle"
                              ? "castle"
                              : pieceType?.name + pieceType?.color
                          ]
                        }
                      />
                    ) : (
                      pieceType &&
                      getPiece(
                        pieceType?.name,
                        pieceType?.color,
                        idx % 2 !== idxj % 2
                      )
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="border-1 w-100 p-2 bg-white h-25">
        <span className="text-2xl">Player 1</span>
        <div className="flex">
          {deleted?.map((i) =>
            i.includes("black") ? (
              <img width={30} src={nameIconSet[i]} />
            ) : (
              <></>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default App;
