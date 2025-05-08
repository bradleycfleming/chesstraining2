"use client";

import React, { useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { Chess, Square } from "chess.js";
import Image from "next/image";
import { useState } from "react";

// export type Puzzle = {
//   PuzzleId: string; // Example field
//   FEN: string; // The FEN string for the chessboard
//   Moves: string;
//   Rating: number;
//   RatingDeviation: number;
//   Popularity: number;
//   NbPlays: number;
//   Themes: string;
//   GameUrl: string;
//   OpeningTags: string | undefined;
// };

// type pieceInfo = {
//   square: string;
//   type: string;
//   color: string;
// };

const Chessboard: React.FC = () => {
  const [previousMove, setPreviousMove] = useState<string[] | undefined>();
  const [movesDisplayed, setMovesDisplayed] = useState(false);
  const [currentSquare, setCurrentSquare] = useState<string>("");
  const [validMoves, setValidMoves] = useState<string[] | undefined>(undefined);
  const [puzzleMoves, setPuzzleMoves] = useState<string[]>([]);
  const [puzzleColor, setPuzzleColor] = useState<string>("");

  const [chess, setChess] = useState(new Chess());

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

  // on loaded get a new puzzle
  useEffect(() => {
    getPuzzle();
  }, []);

  // on puzzleMoves loaded make the first move
  useEffect(() => {
    if (puzzleMoves) {
      makeComputerMove();
    }
  }, [puzzleMoves]);

  // functions
  const getPuzzle = async () => {
    const { data: puzzle, error } = await supabase
      .from("randompuzzles")
      .select("*")
      .limit(1)
      .single();

    if (error || !puzzle) {
      console.error("Error fetching random puzzle:", error);
      return null; // Return null if there's an error or no puzzle
    }

    const newChess = new Chess(puzzle.FEN);
    setPuzzleColor(flipColor(newChess.turn()));
    setChess(newChess);
    setPuzzleMoves(puzzle.Moves.split(" "));
    console.log(puzzle.Moves.split(" "));
  };

  // first move is a computer move so initial turn color is wrong
  const flipColor = (color: string) => {
    if (color === "b") return "w";
    else if (color === "w") return "b";
    else return "";
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const targetSquare = event.currentTarget.id;
    // user clicks on piece that is active (Hide moves)
    if (currentSquare == targetSquare) {
      setMovesDisplayed(false);
      setValidMoves([]);
      setCurrentSquare("");
      // user clicks on an inactive piece from an active piece (Attempt a move)
    } else if (movesDisplayed && validMoves?.includes(targetSquare)) {
      if (isCorrectMove(targetSquare)) {
        chess.move({ from: currentSquare, to: targetSquare });
        setValidMoves(undefined);
        setCurrentSquare("");
        setMovesDisplayed(false);
      } else {
        alert("WRONG NERD");
      }
      // user clicks on an inactive piece with no active piece (Show moves)
    } else {
      listMoves(targetSquare);
      setCurrentSquare(targetSquare);
      setMovesDisplayed(true);
    }
  };

  const isCorrectMove = (targetSquare: string) => {
    const correct = puzzleMoves[0] == currentSquare + targetSquare;
    if (correct) {
      // bump that move from the list
      setPuzzleMoves(puzzleMoves.slice(1));
      setPreviousMove([currentSquare, targetSquare]);
    }
    return correct;
  };

  const makeComputerMove = () => {
    const move = puzzleMoves.shift();
    if (move) {
      chess.move({
        from: move.slice(0, 2),
        to: move.slice(2, 4),
      });
      setPreviousMove([move.slice(0, 2), move.slice(2, 4)]);
    }
  };

  const listMoves = (targetSquare: string) => {
    const moves = chess.moves({ square: targetSquare as Square });
    const moveSquares = moves.map((move) =>
      move.replace(/[+#]/g, "").slice(-2)
    );
    setValidMoves(moveSquares);
  };

  const renderSquares = () => {
    const squares = [];
    const board = chess.board();
    const labelFile = puzzleColor === "w" ? "h" : "a"
    const labelRank = puzzleColor === "w" ? 1 : 8
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const pieceInfo = board[row][col];
        const square = `${files[col]}${ranks[row]}`;
        const isDark = (row + col) % 2 === 1;
        squares.push(
          <div
            key={square}
            id={square}
            className=""
            onClick={handleClick}
            style={{
              backgroundColor: isDark ? "#b18863" : "#eedab5",
              width: "12.5%", // 1/8th of the board width
              height: "12.5%", // 1/8th of the board height
              position: "relative",
            }}
          >
            {/* Render currently selected square*/}
            {currentSquare == square &&
              pieceInfo != null &&
              pieceInfo.color == puzzleColor && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    pointerEvents: "none", // Prevent the circle from blocking clicks
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0, 128, 0, 0.5)", // Darker green with transparency
                    }}
                  ></div>
                </div>
              )}
            {/* Render previous move indicator */}
            {previousMove?.includes(square) && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  pointerEvents: "none", // Prevent the circle from blocking clicks
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(204, 204, 0, 0.5)", // Darker yellow with more opacity
                  }}
                ></div>
              </div>
            )}
            {/* Render pieces on the board*/}
            {pieceInfo != null && (
              <Image
                src={`/${pieceInfo.color}${pieceInfo.type}.png`}
                alt="White Pawn"
                fill
                sizes="100px"
                style={{ objectFit: "scale-down" }} // Use style for object-fit
                className=""
              />
            )}
            {/* Render rank labels */}
            {files[col] === labelFile && (
              <div
                className="absolute top-0 right-1"
                style={{
                  color: isDark ? "#eedab5" : "#b18863",
                  fontSize: "65%",
                }}
              >
                {ranks[row]}
              </div>
            )}
            {/* Render file labels */}
            {ranks[row] === labelRank && (
              <div
                className="absolute bottom-0 left-1"
                style={{
                  color: isDark ? "#eedab5" : "#b18863",
                  fontSize: "65%",
                }}
              >
                {files[col]}
              </div>
            )}
            {/* Render a green circle for valid moves */}
            {validMoves?.includes(square) && (
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
    <div
      className={`flex w-full max-w-lg h-full max-h-lg aspect-square ${
        puzzleColor === "w" ? "flex-wrap" : "flex-wrap-reverse flex-row-reverse"
      }`}
    >
      {renderSquares()}
    </div>
  );
};

export default Chessboard;
