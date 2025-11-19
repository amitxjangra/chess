import Bishop from "./bishop";
import Rook from "./rook";
import King from "./king";
import Queen from "./queen";
import Knight from "./knight";
import Pawn from "./pawn";

const getPiece = (name: string, color: string, isBlack) => {
  console.log("color", color);
  switch (name) {
    case "rook":
      return (
        <Rook
          fill={color === "white" ? "#C0C0C0" : "#B8860B"}
          outline={color === "white" ? "#FFFFFF" : "#1C1C1C"}
          style={{ height: "80%" }}
        />
      );
    case "pawn":
      return (
        <Pawn
          fill={color === "white" ? "#C0C0C0" : "#B8860B"}
          outline={color === "white" ? "#FFFFFF" : "#1C1C1C"}
          style={{ height: "70%" }}
        />
      );
    case "knight":
      return (
        <Knight
          fill={color === "white" ? "#C0C0C0" : "#B8860B"}
          outline={color === "white" ? "#FFFFFF" : "#1C1C1C"}
          style={{ height: "80%" }}
        />
      );
    case "bishop":
      return (
        <Bishop
          fill={color === "white" ? "#C0C0C0" : "#B8860B"}
          outline={color === "white" ? "#FFFFFF" : "#1C1C1C"}
          style={{ height: "80%" }}
        />
      );
    case "queen":
      return (
        <Queen
          fill={color === "white" ? "#C0C0C0" : "#B8860B"}
          outline={color === "white" ? "#FFFFFF" : "#1C1C1C"}
          style={{ height: "80%" }}
        />
      );
    case "king":
      return (
        <King
          fill={color === "white" ? "#C0C0C0" : "#B8860B"}
          outline={color === "white" ? "#FFFFFF" : "#1C1C1C"}
          style={{ height: "80%" }}
        />
      );
    default:
      return null;
  }
};
export { getPiece };
