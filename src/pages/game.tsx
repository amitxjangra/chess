import { nameIconSet, useChessBoard } from "../hooks/useChessBoard";
const row = Array(8).fill("");
// const DARK_COLOR = "#739552";
// const LIGHT_COLOR = "#ebecd0";
const DARK_COLOR = "rgb(37,37,37)";
const LIGHT_COLOR = "rgb(135,135,135)";

function GameScreen() {
  const {
    positions,
    deleted,
    drawSuggestion,
    isCheck,
    winner,
    promotionState,
    promote,
  } = useChessBoard();

  return (
    <div className="h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-950 flex items-center justify-center relative overflow-hidden p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(139, 92, 246, 0.1) 35px, rgba(139, 92, 246, 0.1) 70px)`,
          }}
        />
      </div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-10 right-10 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      {isCheck && !winner && (
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-yellow-500 text-yellow-950 px-6 py-2 rounded-full font-serif font-bold text-sm shadow-lg animate-pulse">
          ⚠️ CHECK!
        </div>
      )}
      {winner && (
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-3 rounded-full font-serif font-bold shadow-[0_0_30px_rgba(168,85,247,0.6)] animate-bounce">
          👑 CHECKMATE! {winner.toUpperCase()} WINS! 👑
        </div>
      )}

      {/* Promotion Modal */}
      {promotionState && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-purple-900 via-violet-900 to-purple-900 border-4 border-purple-500 rounded-2xl p-8 shadow-[0_0_60px_rgba(168,85,247,0.8)]">
            <h2 className="text-3xl font-serif font-bold text-center mb-6 text-transparent bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text">
              Promote Your Pawn
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => promote(promotionState.position, "queen")}
                className="group relative bg-gradient-to-br from-purple-800 to-violet-800 hover:from-purple-700 hover:to-violet-700 border-2 border-purple-500/50 hover:border-purple-400 rounded-xl p-6 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
              >
                <img
                  src={nameIconSet[`queen${promotionState.color}`]}
                  alt="Queen"
                  className="w-20 h-20"
                />
                <p className="text-purple-200 text-sm font-serif mt-2 text-center">
                  Queen
                </p>
              </button>
              <button
                onClick={() => promote(promotionState.position, "rook")}
                className="group relative bg-gradient-to-br from-purple-800 to-violet-800 hover:from-purple-700 hover:to-violet-700 border-2 border-purple-500/50 hover:border-purple-400 rounded-xl p-6 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
              >
                <img
                  src={nameIconSet[`rook${promotionState.color}`]}
                  alt="Rook"
                  className="w-20 h-20"
                />
                <p className="text-purple-200 text-sm font-serif mt-2 text-center">
                  Rook
                </p>
              </button>
              <button
                onClick={() => promote(promotionState.position, "bishop")}
                className="group relative bg-gradient-to-br from-purple-800 to-violet-800 hover:from-purple-700 hover:to-violet-700 border-2 border-purple-500/50 hover:border-purple-400 rounded-xl p-6 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
              >
                <img
                  src={nameIconSet[`bishop${promotionState.color}`]}
                  alt="Bishop"
                  className="w-20 h-20"
                />
                <p className="text-purple-200 text-sm font-serif mt-2 text-center">
                  Bishop
                </p>
              </button>
              <button
                onClick={() => promote(promotionState.position, "knight")}
                className="group relative bg-gradient-to-br from-purple-800 to-violet-800 hover:from-purple-700 hover:to-violet-700 border-2 border-purple-500/50 hover:border-purple-400 rounded-xl p-6 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
              >
                <img
                  src={nameIconSet[`knight${promotionState.color}`]}
                  alt="Knight"
                  className="w-20 h-20"
                />
                <p className="text-purple-200 text-sm font-serif mt-2 text-center">
                  Knight
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex gap-4 w-full max-w-7xl h-full">
        {/* Left side - Chess Board */}
        <div className="flex-1 flex flex-col gap-2 min-h-0">
          {/* Player 2 Info */}
          <div className="bg-gradient-to-r from-purple-900/80 to-violet-900/80 backdrop-blur-md border-2 border-purple-500/50 rounded-xl p-3 shadow-[0_0_30px_rgba(168,85,247,0.3)] flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-2xl shadow-lg">
                  ♕
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-purple-100">
                    Player 2
                  </h3>
                  <p className="text-xs text-purple-300">Black Pieces</p>
                </div>
              </div>
              <div className="flex gap-1 flex-wrap max-w-xs">
                {deleted?.map((i, index) =>
                  i.includes("white") ? (
                    <div
                      key={`deleted-white-${index}`}
                      className="w-8 h-8 bg-purple-950/50 rounded flex items-center justify-center border border-purple-700/30"
                    >
                      <img
                        width={20}
                        src={nameIconSet[i]}
                        className="opacity-70"
                      />
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>

          {/* Chess Board Container */}
          <div className="relative flex-1 flex items-center justify-center min-h-0 overflow-hidden">
            {/* Board frame */}
            {/* <div className="absolute -inset-4 bg-gradient-to-br from-amber-800/40 via-yellow-800/40 to-amber-800/40 rounded-2xl blur-sm" /> */}
            {/* <div className="absolute -inset-3 bg-gradient-to-br from-amber-900 via-yellow-900 to-amber-900 rounded-xl shadow-2xl" /> */}

            {/* Check/Checkmate alerts */}

            {/* The actual chess board */}
            <div className="relative bg-amber-950 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] max-h-full h-auto w-auto max-w-2xl aspect-square">
              {row.map((i, idx) => {
                return (
                  <div
                    key={idx}
                    className="block flex w-full aspect-[8/1] max-w-150"
                  >
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
                          {pieceType && (
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
                              style={{ height: "80%" }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Player 1 Info */}
          <div className="bg-gradient-to-r from-purple-900/80 to-violet-900/80 backdrop-blur-md border-2 border-purple-500/50 rounded-xl p-3 shadow-[0_0_30px_rgba(168,85,247,0.3)] flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-2xl shadow-lg">
                  ♔
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-purple-100">
                    Player 1
                  </h3>
                  <p className="text-xs text-purple-300">White Pieces</p>
                </div>
              </div>
              <div className="flex gap-1 flex-wrap max-w-xs">
                {deleted?.map((i, index) =>
                  i.includes("black") ? (
                    <div
                      key={`deleted-black-${index}`}
                      className="w-8 h-8 bg-purple-950/50 rounded flex items-center justify-center border border-purple-700/30"
                    >
                      <img
                        width={20}
                        src={nameIconSet[i]}
                        className="opacity-70"
                      />
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Game Info */}
        <div className="w-80 flex flex-col gap-4 flex-shrink-0 min-h-0 overflow-y-auto">
          {/* Game Title */}
          <div className="bg-gradient-to-br from-purple-900/90 via-violet-900/90 to-purple-900/90 backdrop-blur-md border-2 border-purple-500/50 rounded-xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
            <div className="text-center space-y-3">
              <div className="text-4xl">👑</div>
              <h2 className="text-2xl font-serif font-bold text-transparent bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text">
                Chess Royale
              </h2>
              <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
              <p className="text-sm text-purple-300 font-serif italic">
                Battle of Wits
              </p>
            </div>
          </div>

          {/* Game Stats */}
          <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-md border-2 border-slate-700/50 rounded-xl p-6 shadow-xl flex-1">
            <h3 className="text-lg font-serif font-bold text-slate-300 mb-4">
              Game Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg">
                <span className="text-sm text-slate-400">Current Turn</span>
                <span className="text-sm font-bold text-purple-300 font-serif">
                  {/* You can add turn indicator here */}
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg">
                <span className="text-sm text-slate-400">Status</span>
                <span
                  className={`text-sm font-bold font-serif ${
                    isCheck
                      ? "text-yellow-400"
                      : winner
                      ? "text-green-400"
                      : "text-slate-300"
                  }`}
                >
                  {winner ? "Game Over" : isCheck ? "Check!" : "In Progress"}
                </span>
              </div>
            </div>
          </div>

          {/* Developer Credit */}
          <div className="bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50 backdrop-blur-md border border-slate-700/30 rounded-xl p-4 shadow-lg">
            <div className="text-center">
              <p className="text-xs text-slate-400 font-serif">Crafted by</p>
              <p className="text-sm font-bold text-transparent bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text font-serif">
                Amit Kumar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameScreen;
