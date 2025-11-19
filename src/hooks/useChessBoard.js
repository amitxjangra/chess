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

export const nameIconSet = {
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
  castle: "/assets/castle.svg",
};

export function useChessBoard() {
  const [turn, setTurn] = useState(true); // true for white
  const [positions, setPositions] = useState(initialPosition);
  const selected = useRef(null);
  const [deleted, setDeleted] = useState([]);
  const [enPassant, setEnPassant] = useState(null); // { pos: "xy", color: "white"|"black" }
  const [isCheck, setIsCheck] = useState(false);
  const [winner, setWinner] = useState(null); // "white" | "black" | null

  // Helper: Find king position for a color
  const findKing = useCallback((pos, color) => {
    for (const key in pos) {
      if (pos[key]?.name === "king" && pos[key]?.color === color) return key;
    }
    return null;
  }, []);

  // Helper: Get all squares attacked by a color
  const getAttackedSquares = useCallback((pos, color) => {
    const attacked = new Set();
    for (const key in pos) {
      const piece = pos[key];
      if (!piece || piece.color !== color || piece.name === "point" || piece.name === "castle") continue;
      const x = parseInt(key[0]), y = parseInt(key[1]);
      
      if (piece.name === "pawn") {
        if (color === "white") {
          if (x - 1 >= 0 && y - 1 >= 0) attacked.add(`${x - 1}${y - 1}`);
          if (x - 1 >= 0 && y + 1 <= 7) attacked.add(`${x - 1}${y + 1}`);
        } else {
          if (x + 1 <= 7 && y - 1 >= 0) attacked.add(`${x + 1}${y - 1}`);
          if (x + 1 <= 7 && y + 1 <= 7) attacked.add(`${x + 1}${y + 1}`);
        }
      } else if (piece.name === "knight") {
        [[x+2,y+1],[x+2,y-1],[x-2,y+1],[x-2,y-1],[x+1,y+2],[x+1,y-2],[x-1,y+2],[x-1,y-2]].forEach(([nx,ny]) => {
          if (nx >= 0 && nx <= 7 && ny >= 0 && ny <= 7) attacked.add(`${nx}${ny}`);
        });
      } else if (piece.name === "king") {
        [[x-1,y-1],[x-1,y],[x-1,y+1],[x,y-1],[x,y+1],[x+1,y-1],[x+1,y],[x+1,y+1]].forEach(([nx,ny]) => {
          if (nx >= 0 && nx <= 7 && ny >= 0 && ny <= 7) attacked.add(`${nx}${ny}`);
        });
      } else if (["rook", "bishop", "queen"].includes(piece.name)) {
        const dirs = [];
        if (["rook", "queen"].includes(piece.name)) dirs.push([1,0],[-1,0],[0,1],[0,-1]);
        if (["bishop", "queen"].includes(piece.name)) dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);
        for (const [dx, dy] of dirs) {
          let nx = x + dx, ny = y + dy;
          while (nx >= 0 && nx <= 7 && ny >= 0 && ny <= 7) {
            attacked.add(`${nx}${ny}`);
            if (pos[`${nx}${ny}`]?.name) break;
            nx += dx; ny += dy;
          }
        }
      }
    }
    return attacked;
  }, []);

  // Helper: Check if a color's king is in check
  const isKingInCheck = useCallback((pos, color) => {
    const kingPos = findKing(pos, color);
    if (!kingPos) return false;
    const oppColor = color === "white" ? "black" : "white";
    const attacked = getAttackedSquares(pos, oppColor);
    return attacked.has(kingPos);
  }, [findKing, getAttackedSquares]);

  // Helper: Check if a move would leave king in check (for filtering illegal moves)
  const wouldBeInCheck = useCallback((fromPos, toPos, currentColor) => {
    const testPos = { ...positions };
    // Simulate the move
    const piece = testPos[fromPos];
    if (!piece) return true;
    delete testPos[fromPos];
    testPos[toPos] = piece;
    // Check if king is in check after move
    return isKingInCheck(testPos, currentColor);
  }, [positions, isKingInCheck]);

  const castle = useCallback((kingPos, rookPos, newKingPos, newRookPos) => {
    const movedColor = positions[kingPos]?.color;
    setTurn((prev) => !prev);
    setEnPassant(null);
    setPositions((prev) => {
      let tempData = { ...prev };
      for (const property in tempData) {
        if (
          tempData[property]?.name === "point" ||
          tempData[property]?.name === "castle"
        ) {
          delete tempData[property];
        }
        if (tempData[property]?.target) {
          tempData[property].target = false;
        }
      }
      const kingPiece = { ...prev[kingPos], hasMoved: true };
      delete tempData[kingPos];
      tempData[newKingPos] = kingPiece;
      const rookPiece = { ...prev[rookPos], hasMoved: true };
      delete tempData[rookPos];
      tempData[newRookPos] = rookPiece;
      
      // Check for check/winner after move
      setTimeout(() => {
        const nextColor = movedColor === "white" ? "black" : "white";
        const inCheck = isKingInCheck(tempData, nextColor);
        setIsCheck(inCheck);
        if (inCheck) {
          // Simple checkmate detection - if king has no safe moves
          const kingPos = findKing(tempData, nextColor);
          if (kingPos) {
            const kx = parseInt(kingPos[0]), ky = parseInt(kingPos[1]);
            const attacked = getAttackedSquares(tempData, movedColor);
            let hasEscape = false;
            for (const [dx, dy] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
              const nx = kx + dx, ny = ky + dy;
              if (nx >= 0 && nx <= 7 && ny >= 0 && ny <= 7) {
                const targetKey = `${nx}${ny}`;
                const targetPiece = tempData[targetKey];
                if ((!targetPiece || targetPiece.color !== nextColor) && !attacked.has(targetKey)) {
                  hasEscape = true;
                  break;
                }
              }
            }
            if (!hasEscape) setWinner(movedColor);
          }
        }
      }, 0);
      
      return tempData;
    });
  }, [positions, isKingInCheck, findKing, getAttackedSquares]);

  const kill = useCallback(
    (killer, target, opts = {}) => {
      const movedColor = positions[killer]?.color;
      if (positions[target]?.name) {
        setDeleted((deletedTemp) => [
          ...deletedTemp,
          positions?.[target]?.name + positions?.[target]?.color,
        ]);
      }
      // En passant: remove captured pawn
      if (opts.enPassant && opts.capturedPawn && positions[opts.capturedPawn]) {
        setDeleted((deletedTemp) => [
          ...deletedTemp,
          positions[opts.capturedPawn].name + positions[opts.capturedPawn].color,
        ]);
      }
      setTurn((prev) => !prev);
      setEnPassant(null);
      setPositions((prev) => {
        let tempData = { ...prev };
        delete tempData[killer];
        if (opts.enPassant && opts.capturedPawn) {
          delete tempData[opts.capturedPawn];
        }
        for (const property in tempData) {
          if (
            tempData[property]?.name === "point" ||
            tempData[property]?.name === "castle"
          ) {
            delete tempData[property];
          }
          // Clear target highlighting from pieces
          if (tempData[property]?.target) {
            tempData[property] = { ...tempData[property], target: false };
          }
        }
        const movingPiece = { ...prev[killer] };
        if (movingPiece.name === "king" || movingPiece.name === "rook") {
          movingPiece.hasMoved = true;
        }
        const newPos = {
          ...tempData,
          [target]: movingPiece,
        };
        
        // Check for check/winner after move
        setTimeout(() => {
          const nextColor = movedColor === "white" ? "black" : "white";
          const inCheck = isKingInCheck(newPos, nextColor);
          setIsCheck(inCheck);
          if (inCheck) {
            const kingPos = findKing(newPos, nextColor);
            if (kingPos) {
              const kx = parseInt(kingPos[0]), ky = parseInt(kingPos[1]);
              const attacked = getAttackedSquares(newPos, movedColor);
              let hasEscape = false;
              for (const [dx, dy] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
                const nx = kx + dx, ny = ky + dy;
                if (nx >= 0 && nx <= 7 && ny >= 0 && ny <= 7) {
                  const targetKey = `${nx}${ny}`;
                  const targetPiece = newPos[targetKey];
                  if ((!targetPiece || targetPiece.color !== nextColor) && !attacked.has(targetKey)) {
                    hasEscape = true;
                    break;
                  }
                }
              }
              if (!hasEscape) setWinner(movedColor);
            }
          }
        }, 0);
        
        return newPos;
      });
    },
    [positions, isKingInCheck, findKing, getAttackedSquares]
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
            if (
              prevPos[property]?.name === "point" ||
              prevPos[property]?.name === "castle"
            ) {
              delete prevPos[property];
            }
            if (prevPos[property]?.target) prevPos[property].target = false;
          }
          selected.current = `${x}${y}`;
          return prevPos;
        });
      }
      if (type === "pawn") {
        // If this square is already marked as a capture target, perform the kill
        if (positions?.[`${x}${y}`]?.target) {
          // Check if this is an en passant capture
          if (positions[`${x}${y}`]?.enPassant) {
            // The captured pawn is on the same row as the attacking pawn
            const sourceX = parseInt(selected.current[0]);
            const capturedPawn = `${sourceX}${y}`;
            kill(selected?.current, `${x}${y}`, { enPassant: true, capturedPawn });
          } else {
            kill(selected?.current, `${x}${y}`);
          }
          return;
        }

        selected.current = `${x}${y}`;

        // Helper to safely check if a board cell is empty (no piece)
        const isEmpty = (p, key) => !p?.[key]?.name;

        if (color === "black") {
          setPositions((prev) => {
            const entries = {};
            const forward = `${x + 1}${y}`;
            const capL = `${x + 1}${y - 1}`;
            const capR = `${x + 1}${y + 1}`;
            const doubleForward = `${x + 2}${y}`;

            // one-step forward
            if (x + 1 <= 7 && isEmpty(prev, forward)) {
              entries[forward] = { name: "point" };
            }

            // two-step from starting row (black pawns start at row 1)
            if (
              x === 1 &&
              x + 2 <= 7 &&
              isEmpty(prev, forward) &&
              isEmpty(prev, doubleForward)
            ) {
              entries[doubleForward] = { name: "point" };
            }

            // captures
            if (x + 1 <= 7 && y - 1 >= 0 && prev[capL]?.name) {
              if (prev[capL].color !== prev[selected.current].color) {
                entries[capL] = { ...prev[capL], target: true };
              }
            }
            if (x + 1 <= 7 && y + 1 <= 7 && prev[capR]?.name) {
              if (prev[capR].color !== prev[selected.current].color) {
                entries[capR] = { ...prev[capR], target: true };
              }
            }

            // En passant for black (capture white pawn on row 4)
            if (enPassant && enPassant.color === "white" && x === 4) {
              if (y - 1 >= 0 && prev[`${x}${y - 1}`]?.name === "pawn" && prev[`${x}${y - 1}`].color === "white" && enPassant.pos === `${x}${y - 1}`) {
                entries[`${x + 1}${y - 1}`] = { name: "point", enPassant: true, target: true };
              }
              if (y + 1 <= 7 && prev[`${x}${y + 1}`]?.name === "pawn" && prev[`${x}${y + 1}`].color === "white" && enPassant.pos === `${x}${y + 1}`) {
                entries[`${x + 1}${y + 1}`] = { name: "point", enPassant: true, target: true };
              }
            }

            // Filter out moves that would leave king in check
            const filtered = {};
            for (const key in entries) {
              if (!wouldBeInCheck(`${x}${y}`, key, color)) {
                filtered[key] = entries[key];
              }
            }

            return { ...prev, ...filtered };
          });
        } else {
          setPositions((prev) => {
            const entries = {};
            const forward = `${x - 1}${y}`;
            const capL = `${x - 1}${y - 1}`;
            const capR = `${x - 1}${y + 1}`;
            const doubleForward = `${x - 2}${y}`;

            // one-step forward
            if (x - 1 >= 0 && isEmpty(prev, forward)) {
              entries[forward] = { name: "point" };
            }

            // two-step from starting row (white pawns start at row 6)
            if (
              x === 6 &&
              x - 2 >= 0 &&
              isEmpty(prev, forward) &&
              isEmpty(prev, doubleForward)
            ) {
              entries[doubleForward] = { name: "point" };
            }

            // captures
            if (x - 1 >= 0 && y - 1 >= 0 && prev[capL]?.name) {
              if (prev[capL].color !== prev[selected.current].color) {
                entries[capL] = { ...prev[capL], target: true };
              }
            }
            if (x - 1 >= 0 && y + 1 <= 7 && prev[capR]?.name) {
              if (prev[capR].color !== prev[selected.current].color) {
                entries[capR] = { ...prev[capR], target: true };
              }
            }

            // En passant for white (capture black pawn on row 3)
            if (enPassant && enPassant.color === "black" && x === 3) {
              if (y - 1 >= 0 && prev[`${x}${y - 1}`]?.name === "pawn" && prev[`${x}${y - 1}`].color === "black" && enPassant.pos === `${x}${y - 1}`) {
                entries[`${x - 1}${y - 1}`] = { name: "point", enPassant: true, target: true };
              }
              if (y + 1 <= 7 && prev[`${x}${y + 1}`]?.name === "pawn" && prev[`${x}${y + 1}`].color === "black" && enPassant.pos === `${x}${y + 1}`) {
                entries[`${x - 1}${y + 1}`] = { name: "point", enPassant: true, target: true };
              }
            }

            // Filter out moves that would leave king in check
            const filtered = {};
            for (const key in entries) {
              if (!wouldBeInCheck(`${x}${y}`, key, color)) {
                filtered[key] = entries[key];
              }
            }

            return { ...prev, ...filtered };
          });
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
          
          // Filter out moves that would leave king in check
          const filtered = { ...prevPos };
          for (const key in filtered) {
            if (filtered[key]?.name === "point" || filtered[key]?.target) {
              if (wouldBeInCheck(`${x}${y}`, key, prev[selected.current].color)) {
                delete filtered[key];
              }
            }
          }
          
          return filtered;
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
          // Kingside castling
          ...(!prev[selected.current]?.hasMoved &&
            !prev[`${x}${y + 1}`]?.name &&
            !prev[`${x}${y + 2}`]?.name &&
            prev[`${x}${y + 3}`]?.name === "rook" &&
            !prev[`${x}${y + 3}`]?.hasMoved &&
            prev[`${x}${y + 3}`]?.color === prev[selected.current]?.color && {
              [`${x}${y + 2}`]: { name: "castle", castleType: "kingside" },
            }),
          // Queenside castling
          ...(!prev[selected.current]?.hasMoved &&
            !prev[`${x}${y - 1}`]?.name &&
            !prev[`${x}${y - 2}`]?.name &&
            !prev[`${x}${y - 3}`]?.name &&
            prev[`${x}${y - 4}`]?.name === "rook" &&
            !prev[`${x}${y - 4}`]?.hasMoved &&
            prev[`${x}${y - 4}`]?.color === prev[selected.current]?.color && {
              [`${x}${y - 2}`]: { name: "castle", castleType: "queenside" },
            }),
        }));
        
        // Filter out king moves that would leave king in check
        setPositions((prev) => {
          const filtered = { ...prev };
          for (const key in filtered) {
            if ((filtered[key]?.name === "point" || filtered[key]?.target) && key !== `${x}${y}`) {
              if (wouldBeInCheck(`${x}${y}`, key, color)) {
                delete filtered[key];
              }
            }
          }
          return filtered;
        });
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
          
          // Filter out moves that would leave king in check
          const filtered = { ...prevPos };
          for (const key in filtered) {
            if (filtered[key]?.name === "point" || filtered[key]?.target) {
              if (wouldBeInCheck(`${x}${y}`, key, prev[selected.current].color)) {
                delete filtered[key];
              }
            }
          }
          
          return filtered;
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
          
          // Filter out moves that would leave king in check
          const filtered = { ...prevPos };
          for (const key in filtered) {
            if (filtered[key]?.name === "point" || filtered[key]?.target) {
              if (wouldBeInCheck(`${x}${y}`, key, prev[selected.current].color)) {
                delete filtered[key];
              }
            }
          }
          
          return filtered;
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
          
          // Filter out moves that would leave king in check
          const filtered = { ...prevPos };
          for (const key in filtered) {
            if (filtered[key]?.name === "point" || filtered[key]?.target) {
              if (wouldBeInCheck(`${x}${y}`, key, prev[selected.current].color)) {
                delete filtered[key];
              }
            }
          }
          
          return filtered;
        });
      }
      if (type === "point") {
        // Handle en passant capture
        if (positions[`${x}${y}`]?.enPassant) {
          const color = positions[selected.current].color;
          const targetX = parseInt(x);
          const capturedPawn = color === "black" ? `${targetX - 1}${y}` : `${targetX + 1}${y}`;
          console.log('🎯 EN PASSANT via point:', {
            from: selected.current,
            to: `${x}${y}`,
            color,
            capturedPawn,
            capturedPiece: positions[capturedPawn]
          });
          kill(selected.current, `${x}${y}`, { enPassant: true, capturedPawn });
          return;
        }
        
        const movedColor = positions[selected.current]?.color;
        console.log('♟️ MOVE:', {
          piece: positions[selected.current]?.name,
          color: movedColor,
          from: selected.current,
          to: `${x}${y}`
        });
        setTurn((prev) => !prev);
        setPositions((prev) => {
          let prevPos = { ...prev };
          for (const property in prevPos) {
            if (
              prevPos[property]?.name === "point" ||
              prevPos[property]?.name === "castle"
            ) {
              delete prevPos[property];
            }
            // Clear target highlighting from pieces
            if (prevPos[property]?.target) {
              prevPos[property] = { ...prevPos[property], target: false };
            }
          }

          // Mark the piece as moved
          let transfer = { ...prevPos[selected.current] };
          if (transfer.name === "king" || transfer.name === "rook") {
            transfer.hasMoved = true;
          }

          // Track pawn double-step for en passant
          if (transfer.name === "pawn" && Math.abs(x - parseInt(selected.current[0])) === 2) {
            setEnPassant({ pos: `${x}${y}`, color: transfer.color });
          } else {
            setEnPassant(null);
          }

          delete prevPos[selected.current];
          prevPos[`${x}${y}`] = transfer;

          // Check for check/winner after move
          setTimeout(() => {
            const nextColor = movedColor === "white" ? "black" : "white";
            const inCheck = isKingInCheck(prevPos, nextColor);
            setIsCheck(inCheck);
            if (inCheck) {
              const kingPos = findKing(prevPos, nextColor);
              if (kingPos) {
                const kx = parseInt(kingPos[0]), ky = parseInt(kingPos[1]);
                const attacked = getAttackedSquares(prevPos, movedColor);
                let hasEscape = false;
                for (const [dx, dy] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
                  const nx = kx + dx, ny = ky + dy;
                  if (nx >= 0 && nx <= 7 && ny >= 0 && ny <= 7) {
                    const targetKey = `${nx}${ny}`;
                    const targetPiece = prevPos[targetKey];
                    if ((!targetPiece || targetPiece.color !== nextColor) && !attacked.has(targetKey)) {
                      hasEscape = true;
                      break;
                    }
                  }
                }
                if (!hasEscape) setWinner(movedColor);
              }
            }
          }, 0);

          return prevPos;
        });
      }

      if (type === "castle") {
        const currentPiece = positions[selected.current];
        if (currentPiece?.name === "king") {
          const castleInfo = positions[`${x}${y}`];
          const kingRow = x;
          const kingCol = parseInt(selected.current[1]);

          if (castleInfo.castleType === "kingside") {
            // Kingside castling: king moves 2 squares right, rook moves 2 squares left
            castle(
              selected.current,
              `${kingRow}${kingCol + 3}`,
              `${kingRow}${kingCol + 2}`,
              `${kingRow}${kingCol + 1}`
            );
          } else if (castleInfo.castleType === "queenside") {
            // Queenside castling: king moves 2 squares left, rook moves 3 squares right
            castle(
              selected.current,
              `${kingRow}${kingCol - 4}`,
              `${kingRow}${kingCol - 2}`,
              `${kingRow}${kingCol - 1}`
            );
          }
        }
        selected.current = null;
      }
    },
    [positions, castle, kill, turn, enPassant, wouldBeInCheck, isKingInCheck, findKing, getAttackedSquares]
  );

  return {
    turn,
    setTurn,
    positions,
    setPositions,
    selected,
    deleted,
    setDeleted,
    castle,
    kill,
    drawSuggestion,
    isCheck,
    winner,
    enPassant,
  };
}
