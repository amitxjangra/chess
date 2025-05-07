import { useCallback, useRef, useState } from "react";

const initialPositon = {
  "00": { name: "rook", color: "black" },
  "01": { name: "knight", color: "black" },
  "02": { name: "bishop", color: "black" },
  "03": { name: "queen", color: "black" },
  "04": { name: "king", color: "black" },
  "05": { name: "bishop", color: "black" },
  "06": { name: "knight", color: "black" },
  "07": { name: "rook", color: "black" },
  10: { name: "pawn", color: "black" },
  11: { name: "pawn", color: "black" },
  12: { name: "pawn", color: "black" },
  13: { name: "pawn", color: "black" },
  14: { name: "pawn", color: "black" },
  15: { name: "pawn", color: "black" },
  16: { name: "pawn", color: "black" },
  17: { name: "pawn", color: "black" },
  60: { name: "pawn", color: "white" },
  61: { name: "pawn", color: "white" },
  62: { name: "pawn", color: "white" },
  63: { name: "pawn", color: "white" },
  64: { name: "pawn", color: "white" },
  65: { name: "pawn", color: "white" },
  66: { name: "pawn", color: "white" },
  67: { name: "pawn", color: "white" },
  70: { name: "rook", color: "white" },
  71: { name: "knight", color: "white" },
  72: { name: "bishop", color: "white" },
  73: { name: "king", color: "white" },
  74: { name: "queen", color: "white" },
  75: { name: "bishop", color: "white" },
  76: { name: "knight", color: "white" },
  77: { name: "rook", color: "white" },
};

const nameIconSet = {
  pawn: "/assets/pawn.png",
  knight: "/assets/knight.png",
  rook: "/assets/rook.png",
  queen: "/assets/queen.png",
  king: "/assets/king.png",
  bishop: "/assets/bishop.png",
  darkPoint: "/assets/dark.png",
  lightPoint: "/assets/light.png",
};

const row = Array(8).fill("");

function App() {
  const [positions, setPositions] = useState(initialPositon);
  const selected = useRef(null);

  const drawSuggestion = useCallback((x, y, type) => {
    if (selected.current === `${x}${y}`) {
      setPositions((prev) => {
        let prevPos = { ...prev };
        for (const property in prevPos) {
          if (prevPos[property]?.name === "point") {
            delete prevPos[property];
          }
        }
        selected.current = null;
        return prevPos;
      });
      return;
    }
    if (type === "pawn") {
      selected.current = `${x}${y}`;
      setPositions((prev) => ({
        ...prev,
        [`${x - 1}${y}`]:
          prev[`${x - 1}${y}`]?.name === "point"
            ? {}
            : prev[`${x - 1}${y}`]?.name
            ? prev[`${x - 1}${y}`]
            : { name: "point" },
        [`${x - 2}${y}`]:
          prev[`${x - 2}${y}`]?.name === "point"
            ? {}
            : prev[`${x - 2}${y}`]?.name
            ? prev[`${x - 2}${y}`]
            : { name: "point" },
      }));
    }
    if (type === "rook") {
      selected.current = `${x}${y}`;
      setPositions((prev) => {
        let prevPos = { ...prev };
        let iterator = 0;
        let detection = {
          left: false,
          right: false,
          top: false,
          bottom: false,
        };
        while (iterator <= 7) {
          if (iterator > x && !detection.bottom) {
            if (prevPos[`${iterator}${y}`]?.name) {
              detection.bottom = true;
            } else {
              prevPos[`${iterator}${y}`] = { name: "point" };
            }
          }
          if (!detection.top) {
            if (prevPos[`${x - iterator - 1}${y}`]?.name) {
              detection.top = true;
            } else {
              prevPos[`${x - iterator - 1}${y}`] = { name: "point" };
            }
          }

          if (!detection.right) {
            if (prevPos[`${x}${y + iterator + 1}`]?.name) {
              detection.right = true;
            } else {
              prevPos[`${x}${y + iterator + 1}`] = { name: "point" };
            }
          }
          if (!detection.left) {
            if (prevPos[`${x}${y - iterator - 1}`]?.name) {
              detection.left = true;
            } else {
              prevPos[`${x}${y - iterator - 1}`] = { name: "point" };
            }
          }
          iterator++;
        }
        return prevPos;
      });
    }
    if (type === "king") {
      selected.current = `${x}${y}`;
      setPositions((prev) => ({
        ...prev,
        [`${x - 1}${y - 1}`]:
          prev[`${x - 1}${y - 1}`]?.name === "point"
            ? {}
            : prev[`${x - 1}${y - 1}`]?.name
            ? prev[`${x - 1}${y - 1}`]
            : { name: "point" },
        [`${x - 1}${y}`]:
          prev[`${x - 1}${y}`]?.name === "point"
            ? {}
            : prev[`${x - 1}${y}`]?.name
            ? prev[`${x - 1}${y}`]
            : { name: "point" },
        [`${x - 1}${y + 1}`]:
          prev[`${x - 1}${y + 1}`]?.name === "point"
            ? {}
            : prev[`${x - 1}${y + 1}`]?.name
            ? prev[`${x - 1}${y + 1}`]
            : { name: "point" },
        [`${x}${y + 1}`]:
          prev[`${x}${y + 1}`]?.name === "point"
            ? {}
            : prev[`${x}${y + 1}`]?.name
            ? prev[`${x}${y + 1}`]
            : { name: "point" },
        [`${x}${y - 1}`]:
          prev[`${x}${y - 1}`]?.name === "point"
            ? {}
            : prev[`${x}${y - 1}`]?.name
            ? prev[`${x}${y - 1}`]
            : { name: "point" },
        [`${x + 1}${y - 1}`]:
          prev[`${x + 1}${y - 1}`]?.name === "point"
            ? {}
            : prev[`${x + 1}${y - 1}`]?.name
            ? prev[`${x + 1}${y - 1}`]
            : { name: "point" },
        [`${x + 1}${y}`]:
          prev[`${x + 1}${y}`]?.name === "point"
            ? {}
            : prev[`${x + 1}${y}`]?.name
            ? prev[`${x + 1}${y}`]
            : { name: "point" },
        [`${x + 1}${y + 1}`]:
          prev[`${x + 1}${y + 1}`]?.name === "point"
            ? {}
            : prev[`${x + 1}${y + 1}`]?.name
            ? prev[`${x + 1}${y + 1}`]
            : { name: "point" },
      }));
    }
    if (type === "bishop") {
      selected.current = `${x}${y}`;
      setPositions((prev) => {
        let prevPos = { ...prev };
        let iterator = 0;
        let detection = {
          tl: false,
          tr: false,
          bl: false,
          br: false,
        };
        while (iterator <= 7) {
          if (!detection.tl) {
            if (prevPos[`${x - 1 - iterator}${y - 1 - iterator}`]?.name) {
              detection.tl = true;
            } else {
              prevPos[`${x - 1 - iterator}${y - 1 - iterator}`] = {
                name: "point",
              };
            }
          }

          if (!detection.bl) {
            if (prevPos[`${x + 1 + iterator}${y - 1 - iterator}`]?.name) {
              detection.bl = true;
            } else {
              prevPos[`${x + 1 + iterator}${y - 1 - iterator}`] = {
                name: "point",
              };
            }
          }
          if (!detection.tr) {
            if (prevPos[`${x - 1 - iterator}${y + 1 + iterator}`]?.name) {
              detection.tr = true;
            } else {
              prevPos[`${x - 1 - iterator}${y + 1 + iterator}`] = {
                name: "point",
              };
            }
          }

          if (!detection.br) {
            if (prevPos[`${x + 1 + iterator}${y + 1 + iterator}`]?.name) {
              detection.br = true;
            } else {
              prevPos[`${x + 1 + iterator}${y + 1 + iterator}`] = {
                name: "point",
              };
            }
          }
          iterator++;
        }
        return prevPos;
      });
    }
    if (type === "knight") {
      selected.current = `${x}${y}`;
      setPositions((prev) => {
        let prevPos = { ...prev };
        let iterator = 0;
        let detection = {
          bl: false,
          lb: false,
          lt: false,
          tl: false,
          tr: false,
          rt: false,
          rb: false,
          br: false,
        };
        while (iterator <= 1) {
          if (!detection.bl) {
            if (prevPos[`${x + 2}${y - 1}`]) {
              detection.bl = true;
            } else {
              prevPos[`${x + 2}${y - 1}`] = {
                name: "point",
              };
            }
          }
          if (!detection.lb) {
            if (prevPos[`${x + 1}${y - 2}`]) {
              detection.lb = true;
            } else {
              prevPos[`${x + 1}${y - 2}`] = {
                name: "point",
              };
            }
          }
          if (!detection.lt) {
            if (prevPos[`${x - 1}${y - 2}`]) {
              detection.lt = true;
            } else {
              prevPos[`${x - 1}${y - 2}`] = {
                name: "point",
              };
            }
          }
          if (!detection.tl) {
            if (prevPos[`${x - 2}${y - 1}`]) {
              detection.tl = true;
            } else {
              prevPos[`${x - 2}${y - 1}`] = {
                name: "point",
              };
            }
          }
          if (!detection.tr) {
            if (prevPos[`${x - 2}${y + 1}`]) {
              detection.tr = true;
            } else {
              prevPos[`${x - 2}${y + 1}`] = {
                name: "point",
              };
            }
          }
          if (!detection.rt) {
            if (prevPos[`${x - 1}${y + 2}`]) {
              detection.rt = true;
            } else {
              prevPos[`${x - 1}${y + 2}`] = {
                name: "point",
              };
            }
          }
          if (!detection.rb) {
            if (prevPos[`${x + 1}${y + 2}`]) {
              detection.rb = true;
            } else {
              prevPos[`${x + 1}${y + 2}`] = {
                name: "point",
              };
            }
          }
          if (!detection.br) {
            if (prevPos[`${x + 2}${y + 1}`]) {
              detection.br = true;
            } else {
              prevPos[`${x + 2}${y + 1}`] = {
                name: "point",
              };
            }
          }

          iterator++;
        }
        return prevPos;
      });
    }
    if (type === "queen") {
      selected.current = `${x}${y}`;

      setPositions((prev) => {
        let prevPos = { ...prev };
        let iterator = 0;
        let detection = {
          left: false,
          right: false,
          top: false,
          bottom: false,
          tl: false,
          tr: false,
          bl: false,
          br: false,
        };
        while (iterator <= 7) {
          if (!detection.tl) {
            if (prevPos[`${x - 1 - iterator}${y - 1 - iterator}`]?.name) {
              detection.tl = true;
            } else {
              prevPos[`${x - 1 - iterator}${y - 1 - iterator}`] = {
                name: "point",
              };
            }
          }

          if (!detection.bl) {
            if (prevPos[`${x + 1 + iterator}${y - 1 - iterator}`]?.name) {
              detection.bl = true;
            } else {
              prevPos[`${x + 1 + iterator}${y - 1 - iterator}`] = {
                name: "point",
              };
            }
          }
          if (!detection.tr) {
            if (prevPos[`${x - 1 - iterator}${y + 1 + iterator}`]?.name) {
              detection.tr = true;
            } else {
              prevPos[`${x - 1 - iterator}${y + 1 + iterator}`] = {
                name: "point",
              };
            }
          }

          if (!detection.br) {
            if (prevPos[`${x + 1 + iterator}${y + 1 + iterator}`]?.name) {
              detection.br = true;
            } else {
              prevPos[`${x + 1 + iterator}${y + 1 + iterator}`] = {
                name: "point",
              };
            }
          }
          if (iterator > x && !detection.bottom) {
            if (prevPos[`${iterator}${y}`]?.name) {
              detection.bottom = true;
            } else {
              prevPos[`${iterator}${y}`] = { name: "point" };
            }
          }
          if (!detection.top) {
            if (prevPos[`${x - iterator - 1}${y}`]?.name) {
              detection.top = true;
            } else {
              prevPos[`${x - iterator - 1}${y}`] = { name: "point" };
            }
          }

          if (!detection.right) {
            if (prevPos[`${x}${y + iterator + 1}`]?.name) {
              detection.right = true;
            } else {
              prevPos[`${x}${y + iterator + 1}`] = { name: "point" };
            }
          }
          if (!detection.left) {
            if (prevPos[`${x}${y - iterator - 1}`]?.name) {
              detection.left = true;
            } else {
              prevPos[`${x}${y - iterator - 1}`] = { name: "point" };
            }
          }
          iterator++;
        }
        return prevPos;
      });
    }
    if (type === "point") {
      setPositions((prev) => {
        let prevPos = { ...prev };
        for (const property in prevPos) {
          if (prevPos[property]?.name === "point") {
            delete prevPos[property];
          }
        }
        let transfer = { ...prevPos[selected.current] };
        delete prevPos[selected.current];
        prevPos[`${x}${y}`] = transfer;

        return prevPos;
      });
    }
  }, []);

  return (
    <>
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
                      if (positions[box.id])
                        drawSuggestion(
                          box.id.split("")[0],
                          box.id.split("")[1],
                          "point"
                        );
                    }}
                    onDragStart={(e) =>
                      drawSuggestion(idx, idxj, pieceType?.name)
                    }
                    onClick={(e) => drawSuggestion(idx, idxj, pieceType?.name)}
                    onDragOver={(ev) => ev.preventDefault()}
                    className="w-[calc(100%/8)] flex justify-center items-center"
                    style={{
                      background: idx % 2 === idxj % 2 ? "black" : "#c8c8c8",
                      color: idx % 2 === idxj % 2 ? "white" : "black",
                    }}
                  >
                    {pieceType && (
                      <img
                        src={
                          nameIconSet[
                            pieceType?.name === "point"
                              ? idx % 2 === idxj % 2
                                ? "lightPoint"
                                : "darkPoint"
                              : pieceType?.name
                          ]
                        }
                      ></img>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
