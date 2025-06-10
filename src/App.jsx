import { useCallback, useRef, useState } from "react";

const initialPosition = {
  "00": { name: "rook", color: "black", hasMoved: false },
  "01": { name: "knight", color: "black" },
  "02": { name: "bishop", color: "black" },
  "04": { name: "king", color: "black", hasMoved: false },
  "03": { name: "queen", color: "black" },
  "05": { name: "bishop", color: "black" },
  "06": { name: "knight", color: "black" },
  "07": { name: "rook", color: "black", hasMoved: false },
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
  70: { name: "rook", color: "white", hasMoved: false },
  71: { name: "knight", color: "white" },
  72: { name: "bishop", color: "white" },
  73: { name: "queen", color: "white" },
  74: { name: "king", color: "white", hasMoved: false },
  75: { name: "bishop", color: "white" },
  76: { name: "knight", color: "white" },
  77: { name: "rook", color: "white", hasMoved: false },
};

const nameIconSet = {
  pawnwhite: "/assets/whitePawn.svg",
  pawnblack: "/assets/blackPawn.svg",
  knightblack: "/assets/blackKnight.svg",
  knightwhite: "/assets/whiteKnight.svg",
  rookwhite: "/assets/whiteRook.svg",
  rookblack: "/assets/blackRook.svg",
  queenblack: "/assets/blackQueen.svg",
  queenwhite: "/assets/whiteQueen.svg",
  kingwhite: "/assets/whiteKing.svg",
  kingblack: "/assets/blackKing.svg",
  bishopblack: "/assets/blackBishop.svg",
  bishopwhite: "/assets/whiteBishop.svg",
  darkPoint: "/assets/dark.png",
  lightPoint: "/assets/light.png",
};

const row = Array(8).fill("");

function App() {
  const [turn, setTurn] = useState(true); // true for white
  const [positions, setPositions] = useState(initialPosition);
  const selected = useRef(null);
  const [deleted, setDeleted] = useState([]);

  const kill = useCallback(
    (killer, target) => {
      if (positions[target].name) {
        setDeleted((deletedTemp) => [
          ...deletedTemp,
          positions?.[target]?.name + positions?.[target]?.color,
        ]);
      }
      setTurn((prev) => !prev);
      setPositions((prev) => {
        let tempData = { ...prev };
        delete tempData[killer];
        for (const property in tempData) {
          if (tempData[property]?.name === "point") {
            delete tempData[property];
          }
        }
        return {
          ...tempData,
          [target]: prev[killer],
        };
      });
    },
    [positions]
  );

  const drawSuggestion = useCallback(
    (x, y, type, color) => {
      if (turn && positions[`${x}${y}`].color === "black") {
        if (!positions[`${x}${y}`].target) return;
      }
      if (!turn && positions[`${x}${y}`].color === "white") {
        if (!positions[`${x}${y}`].target) return;
      }

      if (selected.current === `${x}${y}`) {
        setPositions((prev) => {
          let prevPos = { ...prev };
          for (const property in prevPos) {
            if (prevPos[property]?.name === "point") {
              delete prevPos[property];
            }
            if (prevPos[property]?.target) prevPos[property].target = false;
          }
          selected.current = null;
          return prevPos;
        });
        return;
      } else if (positions[`${x}${y}`].name !== "point") {
        setPositions((prev) => {
          let prevPos = { ...prev };
          for (const property in prevPos) {
            if (prevPos[property]?.name === "point") {
              delete prevPos[property];
            }
            if (prevPos[property]?.target) prevPos[property].target = false;
          }
          selected.current = `${x}${y}`;
          return prevPos;
        });
      }
      if (type === "pawn") {
        if (positions?.[`${x}${y}`]?.target) {
          kill(selected?.current, `${x}${y}`);
          return;
        }
        selected.current = `${x}${y}`;
        if (color === "black") {
          setPositions((prev) => {
            return {
              ...prev,
              [`${x + 1}${y}`]:
                prev[`${x + 1}${y}`]?.name === "point"
                  ? {}
                  : prev[`${x + 1}${y}`]?.name
                  ? { ...prev[`${x + 1}${y}`] }
                  : { name: "point" },
              ...(prev[`${x + 1}${y - 1}`]?.name && {
                [`${x + 1}${y - 1}`]: {
                  ...prev[`${x + 1}${y - 1}`],
                  ...(prev[`${x + 1}${y - 1}`].color !==
                    prev[selected.current].color && { target: true }),
                },
              }),
              ...(prev[`${x + 1}${y + 1}`]?.name && {
                [`${x + 1}${y + 1}`]: {
                  ...prev[`${x + 1}${y + 1}`],
                  ...(prev[`${x + 1}${y + 1}`].color !==
                    prev[selected.current].color && { target: true }),
                },
              }),
              [`${x + 2}${y}`]:
                x === 6 || x === 1
                  ? prev[`${x + 2}${y}`]?.name === "point"
                    ? {}
                    : prev[`${x + 2}${y}`]?.name
                    ? prev[`${x + 2}${y}`]
                    : prev[`${x + 1}${y}`]?.name
                    ? {}
                    : { name: "point" }
                  : prev[`${x + 2}${y}`],
            };
          });
        } else {
          setPositions((prev) => ({
            ...prev,
            [`${x - 1}${y}`]:
              prev[`${x - 1}${y}`]?.name === "point"
                ? {}
                : prev[`${x - 1}${y}`]?.name
                ? { ...prev[`${x - 1}${y}`] }
                : { name: "point" },
            [`${x - 1}${y - 1}`]: prev[`${x - 1}${y - 1}`]?.name
              ? {
                  ...prev[`${x - 1}${y - 1}`],
                  ...(prev[`${x - 1}${y - 1}`].color !==
                    prev[selected.current].color && { target: true }),
                }
              : {},
            [`${x - 1}${y + 1}`]: prev[`${x - 1}${y + 1}`]?.name
              ? {
                  ...prev[`${x - 1}${y + 1}`],
                  ...(prev[`${x - 1}${y + 1}`].color !==
                    prev[selected.current].color && { target: true }),
                }
              : {},
            [`${x - 2}${y}`]:
              x === 6 || x === 1
                ? prev[`${x - 2}${y}`]?.name === "point"
                  ? {}
                  : prev[`${x - 2}${y}`]?.name
                  ? prev[`${x - 2}${y}`]
                  : prev[`${x - 1}${y}`]?.name
                  ? {}
                  : { name: "point" }
                : prev[`${x - 2}${y}`],
          }));
        }
      }
      if (type === "rook") {
        if (positions?.[`${x}${y}`]?.target) {
          kill(selected?.current, `${x}${y}`);
          return;
        }
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
                if (
                  prev[selected.current].color !==
                  prevPos[`${iterator}${y}`].color
                )
                  prevPos[`${iterator}${y}`] = {
                    ...prevPos[`${iterator}${y}`],
                    target: true,
                  };
                detection.bottom = true;
              } else {
                prevPos[`${iterator}${y}`] = { name: "point" };
              }
            }
            if (!detection.top) {
              if (prevPos[`${x - iterator - 1}${y}`]?.name) {
                if (
                  prev[selected.current].color !==
                  prevPos[`${x - iterator - 1}${y}`].color
                )
                  prevPos[`${x - iterator - 1}${y}`] = {
                    ...prevPos[`${x - iterator - 1}${y}`],
                    target:
                      prevPos[`${x - iterator - 1}${y}`]?.color !== color
                        ? true
                        : false,
                  };
                detection.top = true;
              } else {
                prevPos[`${x - iterator - 1}${y}`] = { name: "point" };
              }
            }

            if (!detection.right) {
              if (prevPos[`${x}${y + iterator + 1}`]?.name) {
                if (
                  prev[selected.current].color !==
                  prevPos[`${x}${y + iterator + 1}`].color
                )
                  prevPos[`${x}${y + iterator + 1}`] = {
                    ...prevPos[`${x}${y + iterator + 1}`],
                    target: true,
                  };
                detection.right = true;
              } else {
                prevPos[`${x}${y + iterator + 1}`] = { name: "point" };
              }
            }
            if (!detection.left) {
              if (prevPos[`${x}${y - iterator - 1}`]?.name) {
                if (
                  prev[selected.current].color !==
                  prevPos[`${x}${y - iterator - 1}`].color
                )
                  prevPos[`${x}${y - iterator - 1}`] = {
                    ...prevPos[`${x}${y - iterator - 1}`],
                    target: true,
                  };
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
        if (positions?.[`${x}${y}`]?.target) {
          kill(selected?.current, `${x}${y}`);
          return;
        }
        selected.current = `${x}${y}`;
        setPositions((prev) => ({
          ...prev,
          [`${x - 1}${y - 1}`]:
            prev[`${x - 1}${y - 1}`]?.name === "point"
              ? {}
              : prev[`${x - 1}${y - 1}`]?.name
              ? {
                  ...prev[`${x - 1}${y - 1}`],
                  ...(prev[`${x - 1}${y - 1}`].color !==
                    prev[selected.current].color && { target: true }),
                }
              : { name: "point" },
          [`${x - 1}${y}`]:
            prev[`${x - 1}${y}`]?.name === "point"
              ? {}
              : prev[`${x - 1}${y}`]?.name
              ? {
                  ...prev[`${x - 1}${y}`],
                  ...(prev[`${x - 1}${y}`].color !==
                    prev[selected.current].color && { target: true }),
                }
              : { name: "point" },
          [`${x - 1}${y + 1}`]:
            prev[`${x - 1}${y + 1}`]?.name === "point"
              ? {}
              : prev[`${x - 1}${y + 1}`]?.name
              ? {
                  ...prev[`${x - 1}${y + 1}`],
                  ...(prev[`${x - 1}${y + 1}`].color !==
                    prev[selected.current].color && { target: true }),
                }
              : { name: "point" },
          [`${x}${y + 1}`]:
            prev[`${x}${y + 1}`]?.name === "point"
              ? {}
              : prev[`${x}${y + 1}`]?.name
              ? {
                  ...prev[`${x}${y + 1}`],
                  ...(prev[`${x}${y + 1}`].color !==
                    prev[selected.current].color && { target: true }),
                }
              : { name: "point" },
          [`${x}${y - 1}`]:
            prev[`${x}${y - 1}`]?.name === "point"
              ? {}
              : prev[`${x}${y - 1}`]?.name
              ? {
                  ...prev[`${x}${y - 1}`],
                  ...(prev[`${x}${y - 1}`].color !==
                    prev[selected.current].color && { target: true }),
                }
              : { name: "point" },
          [`${x + 1}${y - 1}`]:
            prev[`${x + 1}${y - 1}`]?.name === "point"
              ? {}
              : prev[`${x + 1}${y - 1}`]?.name
              ? {
                  ...prev[`${x + 1}${y - 1}`],
                  ...(prev[`${x + 1}${y - 1}`].color !==
                    prev[selected.current].color && { target: true }),
                }
              : { name: "point" },
          [`${x + 1}${y}`]:
            prev[`${x + 1}${y}`]?.name === "point"
              ? {}
              : prev[`${x + 1}${y}`]?.name
              ? {
                  ...prev[`${x + 1}${y}`],
                  ...(prev[`${x + 1}${y}`].color !==
                    prev[selected.current].color && { target: true }),
                }
              : { name: "point" },
          [`${x + 1}${y + 1}`]:
            prev[`${x + 1}${y + 1}`]?.name === "point"
              ? {}
              : prev[`${x + 1}${y + 1}`]?.name
              ? {
                  ...prev[`${x + 1}${y + 1}`],
                  ...(prev[`${x + 1}${y + 1}`].color !==
                    prev[selected.current].color && { target: true }),
                }
              : { name: "point" },
          ...(true && { [`${x}${y + 2}`]: { name: "point" } }),
          ...(true && { [`${x}${y - 2}`]: { name: "point" } }),
        }));
      }
      if (type === "bishop") {
        if (positions?.[`${x}${y}`]?.target) {
          kill(selected?.current, `${x}${y}`);
          return;
        }
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
                if (
                  prev[selected.current].color !==
                  prevPos[`${x - 1 - iterator}${y - 1 - iterator}`].color
                )
                  prevPos[`${x - 1 - iterator}${y - 1 - iterator}`] = {
                    ...prevPos[`${x - 1 - iterator}${y - 1 - iterator}`],
                    target: true,
                  };
                detection.tl = true;
              } else {
                prevPos[`${x - 1 - iterator}${y - 1 - iterator}`] = {
                  name: "point",
                };
              }
            }

            if (!detection.bl) {
              if (prevPos[`${x + 1 + iterator}${y - 1 - iterator}`]?.name) {
                if (
                  prev[selected.current].color !==
                  prevPos[`${x + 1 + iterator}${y - 1 - iterator}`].color
                )
                  prevPos[`${x + 1 + iterator}${y - 1 - iterator}`] = {
                    ...prevPos[`${x + 1 + iterator}${y - 1 - iterator}`],
                    target: true,
                  };
                detection.bl = true;
              } else {
                prevPos[`${x + 1 + iterator}${y - 1 - iterator}`] = {
                  name: "point",
                };
              }
            }
            if (!detection.tr) {
              if (prevPos[`${x - 1 - iterator}${y + 1 + iterator}`]?.name) {
                if (
                  prev[selected.current].color !==
                  prevPos[`${x - 1 - iterator}${y + 1 + iterator}`].color
                )
                  prevPos[`${x - 1 - iterator}${y + 1 + iterator}`] = {
                    ...prevPos[`${x - 1 - iterator}${y + 1 + iterator}`],
                    target: true,
                  };
                detection.tr = true;
              } else {
                prevPos[`${x - 1 - iterator}${y + 1 + iterator}`] = {
                  name: "point",
                };
              }
            }

            if (!detection.br) {
              if (prevPos[`${x + 1 + iterator}${y + 1 + iterator}`]?.name) {
                if (
                  prev[selected.current].color !==
                  prevPos[`${x + 1 + iterator}${y + 1 + iterator}`].color
                )
                  prevPos[`${x + 1 + iterator}${y + 1 + iterator}`] = {
                    ...prevPos[`${x + 1 + iterator}${y + 1 + iterator}`],
                    target: true,
                  };
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
        if (positions?.[`${x}${y}`]?.target) {
          kill(selected?.current, `${x}${y}`);
          return;
        }
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
              if (
                prevPos[`${x + 2}${y - 1}`]?.name &&
                prevPos[`${x + 2}${y - 1}`]?.name !== "point"
              ) {
                if (
                  prev[selected.current].color !==
                  prevPos[`${x + 2}${y - 1}`].color
                )
                  prevPos[`${x + 2}${y - 1}`] = {
                    ...prevPos[`${x + 2}${y - 1}`],
                    target: true,
                  };
                detection.bl = true;
              } else {
                prevPos[`${x + 2}${y - 1}`] = {
                  name: "point",
                };
              }
            }
            if (!detection.lb) {
              if (
                prevPos[`${x + 1}${y - 2}`]?.name &&
                prevPos[`${x + 1}${y - 2}`]?.name !== "point"
              ) {
                if (
                  prev[selected.current].color !==
                  prevPos[`${x + 1}${y - 2}`].color
                )
                  prevPos[`${x + 1}${y - 2}`] = {
                    ...prevPos[`${x + 1}${y - 2}`],
                    target: true,
                  };
                detection.lb = true;
              } else {
                prevPos[`${x + 1}${y - 2}`] = {
                  name: "point",
                };
              }
            }
            if (!detection.lt) {
              if (
                prevPos[`${x - 1}${y - 2}`]?.name &&
                prevPos[`${x - 1}${y - 2}`]?.name !== "point"
              ) {
                if (
                  prev[selected.current].color !==
                  prevPos[`${x - 1}${y - 2}`].color
                )
                  prevPos[`${x - 1}${y - 2}`] = {
                    ...prevPos[`${x - 1}${y - 2}`],
                    target: true,
                  };
                detection.lt = true;
              } else {
                prevPos[`${x - 1}${y - 2}`] = {
                  name: "point",
                };
              }
            }
            if (!detection.tl) {
              if (
                prevPos[`${x - 2}${y - 1}`]?.name &&
                prevPos[`${x - 2}${y - 1}`]?.name !== "point"
              ) {
                if (
                  prev[selected.current].color !==
                  prevPos[`${x - 2}${y - 1}`].color
                )
                  prevPos[`${x - 2}${y - 1}`] = {
                    ...prevPos[`${x - 2}${y - 1}`],
                    target: true,
                  };
                detection.tl = true;
              } else {
                prevPos[`${x - 2}${y - 1}`] = {
                  name: "point",
                };
              }
            }
            if (!detection.tr) {
              if (
                prevPos[`${x - 2}${y + 1}`]?.name &&
                prevPos[`${x - 2}${y + 1}`]?.name !== "point"
              ) {
                if (
                  prev[selected.current].color !==
                  prevPos[`${x - 2}${y + 1}`].color
                )
                  prevPos[`${x - 2}${y + 1}`] = {
                    ...prevPos[`${x - 2}${y + 1}`],
                    target: true,
                  };
                detection.tr = true;
              } else {
                prevPos[`${x - 2}${y + 1}`] = {
                  name: "point",
                };
              }
            }
            if (!detection.rt) {
              if (
                prevPos[`${x - 1}${y + 2}`]?.name &&
                prevPos[`${x - 1}${y + 2}`]?.name !== "point"
              ) {
                if (
                  prev[selected.current].color !==
                  prevPos[`${x - 1}${y + 2}`].color
                )
                  prevPos[`${x - 1}${y + 2}`] = {
                    ...prevPos[`${x - 1}${y + 2}`],
                    target: true,
                  };
                detection.rt = true;
              } else {
                prevPos[`${x - 1}${y + 2}`] = {
                  name: "point",
                };
              }
            }
            if (!detection.rb) {
              if (
                prevPos[`${x + 1}${y + 2}`]?.name &&
                prevPos[`${x + 1}${y + 2}`]?.name !== "point"
              ) {
                if (
                  prev[selected.current].color !==
                  prevPos[`${x + 1}${y + 2}`].color
                )
                  prevPos[`${x + 1}${y + 2}`] = {
                    ...prevPos[`${x + 1}${y + 2}`],
                    target: true,
                  };
                detection.rb = true;
              } else {
                prevPos[`${x + 1}${y + 2}`] = {
                  name: "point",
                };
              }
            }
            if (!detection.br) {
              if (
                prevPos[`${x + 2}${y + 1}`]?.name &&
                prevPos[`${x + 2}${y + 1}`]?.name !== "point"
              ) {
                if (
                  prev[selected.current].color !==
                  prevPos[`${x + 2}${y + 1}`].color
                )
                  prevPos[`${x + 2}${y + 1}`] = {
                    ...prevPos[`${x + 2}${y + 1}`],
                    target: true,
                  };
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
        if (positions?.[`${x}${y}`]?.target) {
          kill(selected?.current, `${x}${y}`);
          return;
        }
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
                if (
                  prev[selected.current].color !==
                  prevPos[`${x - 1 - iterator}${y - 1 - iterator}`].color
                )
                  prevPos[`${x - 1 - iterator}${y - 1 - iterator}`] = {
                    ...prevPos[`${x - 1 - iterator}${y - 1 - iterator}`],
                    target: true,
                  };
                detection.tl = true;
              } else {
                prevPos[`${x - 1 - iterator}${y - 1 - iterator}`] = {
                  name: "point",
                };
              }
            }

            if (!detection.bl) {
              if (prevPos[`${x + 1 + iterator}${y - 1 - iterator}`]?.name) {
                if (
                  prev[selected.current].color !==
                  prevPos[`${x + 1 + iterator}${y - 1 - iterator}`].color
                )
                  prevPos[`${x + 1 + iterator}${y - 1 - iterator}`] = {
                    ...prevPos[`${x + 1 + iterator}${y - 1 - iterator}`],
                    target: true,
                  };
                detection.bl = true;
              } else {
                prevPos[`${x + 1 + iterator}${y - 1 - iterator}`] = {
                  name: "point",
                };
              }
            }
            if (!detection.tr) {
              if (prevPos[`${x - 1 - iterator}${y + 1 + iterator}`]?.name) {
                if (
                  prev[selected.current].color !==
                  prevPos[`${x - 1 - iterator}${y + 1 + iterator}`].color
                )
                  prevPos[`${x - 1 - iterator}${y + 1 + iterator}`] = {
                    ...prevPos[`${x - 1 - iterator}${y + 1 + iterator}`],
                    target: true,
                  };
                detection.tr = true;
              } else {
                prevPos[`${x - 1 - iterator}${y + 1 + iterator}`] = {
                  name: "point",
                };
              }
            }

            if (!detection.br) {
              if (prevPos[`${x + 1 + iterator}${y + 1 + iterator}`]?.name) {
                if (
                  prev[selected.current].color !==
                  prevPos[`${x + 1 + iterator}${y + 1 + iterator}`].color
                )
                  prevPos[`${x + 1 + iterator}${y + 1 + iterator}`] = {
                    ...prevPos[`${x + 1 + iterator}${y + 1 + iterator}`],
                    target: true,
                  };
                detection.br = true;
              } else {
                prevPos[`${x + 1 + iterator}${y + 1 + iterator}`] = {
                  name: "point",
                };
              }
            }
            if (iterator > x && !detection.bottom) {
              if (prevPos[`${iterator}${y}`]?.name) {
                if (
                  prev[selected.current].color !==
                  prevPos[`${iterator}${y}`].color
                )
                  prevPos[`${iterator}${y}`] = {
                    ...prevPos[`${iterator}${y}`],
                    target: true,
                  };
                detection.bottom = true;
              } else {
                prevPos[`${iterator}${y}`] = { name: "point" };
              }
            }
            if (!detection.top) {
              if (prevPos[`${x - iterator - 1}${y}`]?.name) {
                if (
                  prev[selected.current].color !==
                  prevPos[`${x - iterator - 1}${y}`].color
                )
                  prevPos[`${x - iterator - 1}${y}`] = {
                    ...prevPos[`${x - iterator - 1}${y}`],
                    target: true,
                  };
                detection.top = true;
              } else {
                prevPos[`${x - iterator - 1}${y}`] = { name: "point" };
              }
            }

            if (!detection.right) {
              if (prevPos[`${x}${y + iterator + 1}`]?.name) {
                if (
                  prev[selected.current].color !==
                  prevPos[`${x}${y + iterator + 1}`].color
                )
                  prevPos[`${x}${y + iterator + 1}`] = {
                    ...prevPos[`${x}${y + iterator + 1}`],
                    target: true,
                  };
                detection.right = true;
              } else {
                prevPos[`${x}${y + iterator + 1}`] = { name: "point" };
              }
            }
            if (!detection.left) {
              if (prevPos[`${x}${y - iterator - 1}`]?.name) {
                if (
                  prev[selected.current].color !==
                  prevPos[`${x}${y - iterator - 1}`].color
                )
                  prevPos[`${x}${y - iterator - 1}`] = {
                    ...prevPos[`${x}${y - iterator - 1}`],
                    target: true,
                  };
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
        setTurn((prev) => !prev);
        // castle(kingPos, rookPos);
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
    },
    [positions]
  );

  return (
    <>
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
                        positions[box.id]?.name === "point"
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
                    onDragStart={(e) =>
                      drawSuggestion(
                        idx,
                        idxj,
                        pieceType?.name,
                        pieceType?.color
                      )
                    }
                    onClick={(e) =>
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
                      background: idx % 2 !== idxj % 2 ? "#739552" : "#ebecd0",
                      color: idx % 2 === idxj % 2 ? "black" : "white",
                      boxShadow: pieceType?.target
                        ? "inset 0px 0px 7px 0px red"
                        : "none",
                    }}
                  >
                    {pieceType && (
                      <img
                        src={
                          nameIconSet[
                            pieceType?.name === "point"
                              ? idx % 2 !== idxj % 2
                                ? "lightPoint"
                                : "darkPoint"
                              : pieceType?.name + pieceType?.color
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
