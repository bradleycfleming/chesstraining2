import React from "react";
import { Chess } from "chess.js";
import Image from "next/image";

type Props = {
    fen: string
};

const Chessboard: React.FC<Props> = (props) => {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  const chess = new Chess(props.fen);

  const renderSquares = () => {
    const squares = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {

        const square = chess.board()[row][col]

        const isDark = (row + col) % 2 === 1;
        squares.push(
          <div
            // could use the actual square name ex: a4, b2
            // maybe need file and rank arrays
            key={`${files[col]}${ranks[row]}`}
            id={`${files[col]}${ranks[row]}`}
            className=""
            style={{
              backgroundColor: isDark ? "#b18863" : "#eedab5",
              width: "12.5%", // 1/8th of the board width
              height: "12.5%", // 1/8th of the board height
              position: "relative",
            }}
          >
            {square != null && (
              <Image
                src={`/${square.color}${square.type}.png`}
                alt="White Pawn"
                layout="fill"
                objectFit="scale-down"
                className=""
              />
            )}
          </div>
        );
      }
    }
    return squares;
  };

  return (
    <div className="flex flex-wrap w-full max-w-lg h-full max-h-lg aspect-square ">
      {renderSquares()}
    </div>
  );
};

const getPiecePosition = (color: string, type: string) => {
  // map pieces to their position in the sprite
  const pieceMap: { [key: string]: { [key: string]: string } } = {
    w: {
      p: "0% 0%", // White Pawn
      r: "0% 12.5%", // White Rook
      n: "0% 25%", // White Knight
      b: "0% 37.5%", // White Bishop
      q: "0% 50%", // White Queen
      k: "0% 62.5%", // White King
    },
    b: {
      p: "12.5% 0%", // Black Pawn
      r: "12.5% 12.5%", // Black Rook
      n: "12.5% 25%", // Black Knight
      b: "12.5% 37.5%", // Black Bishop
      q: "12.5% 50%", // Black Queen
      k: "12.5% 62.5%", // Black King
    },
  };

  return pieceMap[color]?.[type] || "0% 0%";
};

// colors
const WHITE = "w";
const BLACK = "b";

// pieces
const PAWN = "p";
const KNIGHT = "n";
const BISHOP = "b";
const ROOK = "r";
const QUEEN = "q";
const KING = "k";

export default Chessboard;
