"use client";

import React, { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
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

const Chessboard: React.FC = () => {
  // const [board, setBoard] = useState(props);
  const [previousMove, setPreviousMove] = useState<string[] | undefined>();
  const [movesDisplayed, setMovesDisplayed] = useState(false);
  const [currentSquare, setCurrentSquare] = useState<string>("");
  const [validMoves, setValidMoves] = useState<string[] | undefined>(undefined);
  const [puzzleMoves, setPuzzleMoves] = useState<string[]>([]);
  // Create a single supabase client for interacting with your database
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [chess, setChess] = useState(new Chess());

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  // on loaded get a new puzzle
  useEffect(() => {
    getPuzzle();
  }, []);

  // on puzzleMoves loaded make the first move
  useEffect(() => {
    console.log(" useEffect" + puzzleMoves);
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
    setChess(new Chess(puzzle.FEN));
    setPuzzleMoves(puzzle.Moves.split(" "));
    // make initial move
    // makeComputerMove();
    console.log(puzzle);
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
      console.log("isCorrect" + puzzleMoves);
      setPreviousMove([currentSquare, targetSquare]);
    }
    return correct;
  };

  const makeComputerMove = () => {
    const move = puzzleMoves.shift();
    console.log("Make computer move" + puzzleMoves);
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
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const pieceInfo = chess.board()[row][col];
        const square = `${files[col]}${ranks[row]}`;
        const isDark = (row + col) % 2 === 1;
        squares.push(
          <div
            // could use the actual square name ex: a4, b2
            // maybe need file and rank arrays
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
            {currentSquare == square && (
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
                layout="fill"
                objectFit="scale-down"
                className=""
              />
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
    <div className="flex flex-wrap w-full max-w-lg h-full max-h-lg aspect-square ">
      {renderSquares()}
    </div>
  );
};

export default Chessboard;
