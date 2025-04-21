"use client";

import React from "react";
import { Chess, Square } from "chess.js";
import Image from "next/image";
import { useState } from "react";

type Props = {
  fen: string;
};

const Chessboard: React.FC<Props> = (props) => {
  // const [board, setBoard] = useState(props);
  const [movesDisplayed, setMovesDisplayed] = useState(false);
  const [currentSquare, setCurrentSquare] = useState<string>("");
  const [validMoves, setValidMoves] = useState<string[] | undefined>(undefined);
  const [chess] = useState(new Chess(props.fen))

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (movesDisplayed && validMoves?.includes(event.currentTarget.id)) {
      chess.move({from: currentSquare, to: event.currentTarget.id});
      setValidMoves(undefined);
      setCurrentSquare("");
      setMovesDisplayed(false);
    } else {
      listMoves(event);
      setCurrentSquare(event.currentTarget.id);
      setMovesDisplayed(true);
    }
  };

  const listMoves = (event: React.MouseEvent<HTMLDivElement>) => {
    const moves = chess.moves({ square: event.currentTarget.id as Square });
    const moveSquares = moves.map((move) =>
      move.replace(/[+#]/g, "").slice(-2)
    );
    setValidMoves(moveSquares);
    console.log(moves);
  };

  const renderSquares = () => {
    const squares = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const pieceInfo = chess.board()[row][col];

        const isDark = (row + col) % 2 === 1;
        squares.push(
          <div
            // could use the actual square name ex: a4, b2
            // maybe need file and rank arrays
            key={`${files[col]}${ranks[row]}`}
            id={`${files[col]}${ranks[row]}`}
            className=""
            onClick={handleClick}
            style={{
              backgroundColor: isDark ? "#b18863" : "#eedab5",
              width: "12.5%", // 1/8th of the board width
              height: "12.5%", // 1/8th of the board height
              position: "relative",
            }}
          >
            {pieceInfo != null && (
              <Image
                src={`/${pieceInfo.color}${pieceInfo.type}.png`}
                alt="White Pawn"
                layout="fill"
                objectFit="scale-down"
                className=""
              />
            )}

            {/* Render a green circle for valid moves */}
            {validMoves?.includes(`${files[col]}${ranks[row]}`) && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  pointerEvents: "none", // Prevent the circle from blocking clicks
                }}
              >
                <div
                  style={{
                    width: "30%",
                    height: "30%",
                    backgroundColor: "rgba(0, 128, 0, 0.5)", // Darker green with transparency
                    borderRadius: "50%",
                  }}
                ></div>
              </div>
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

export default Chessboard;
