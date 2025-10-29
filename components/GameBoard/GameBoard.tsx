import "./GameBoard.css";
import { useAtom } from "jotai";
import { gameboardAtom } from "../../store/atoms";
import { useEffect, useRef, useState } from "react";

function GameBoard() {
  const [board, setBoard] = useAtom(gameboardAtom);
  const [direction, setDirection] = useState<string>("left");
  const directionRef = useRef(direction);
  const updateCell = (row: number, col: number, value: string) => {
    setBoard((prevBoard) =>
      prevBoard.map((r, rowIndex) =>
        rowIndex === row
          ? r.map((cell, colIndex) => (colIndex === col ? value : cell))
          : r
      )
    );
  };
  const gameTick = () => {
    setBoard((prevBoard) => {
      let snakerow = 10;
      let snakecol = 10;

      for (let row = 0; row < prevBoard.length; row++) {
        for (let col = 0; col < prevBoard[row].length; col++) {
          if (
            ["up", "down", "left", "right"].includes(
              prevBoard[row][col] as string
            )
          ) {
            snakerow = row;
            snakecol = col;
          }
        }
      }

      const newBoard = prevBoard.map((r) => [...r]);
      const currentDirection = directionRef.current; // always latest

      switch (currentDirection) {
        case "up":
          newBoard[snakerow][snakecol] = "";
          newBoard[snakerow - 1][snakecol] = "up";
          break;
        case "down":
          newBoard[snakerow][snakecol] = "";
          newBoard[snakerow + 1][snakecol] = "down";
          break;
        case "left":
          newBoard[snakerow][snakecol] = "";
          newBoard[snakerow][snakecol - 1] = "left";
          break;
        case "right":
          newBoard[snakerow][snakecol] = "";
          newBoard[snakerow][snakecol + 1] = "right";
          break;
      }

      return newBoard;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          setDirection("up");
          break;
        case "ArrowDown":
          setDirection("down");
          break;
        case "ArrowLeft":
          setDirection("left");
          break;
        case "ArrowRight":
          setDirection("right");
          break;
      }
    };

    updateCell(10, 10, "right");
    const intervalId = setInterval(() => {
      gameTick();
    }, 300);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(intervalId);
    };
  }, []);
  useEffect(() => {
    directionRef.current = direction; // keep ref updated
  }, [direction]);
  return (
    <>
      <div className="game-board">
        {board.map((row, rowIndex) =>
          row.map((cell, cellIndex) =>
            cell == "right" ||
            cell == "left" ||
            cell == "up" ||
            cell == "down" ? (
              <div className="head"></div>
            ) : (
              <div
                className="cell"
                style={
                  (rowIndex + cellIndex) % 2 == 0
                    ? { backgroundColor: "gray" }
                    : { backgroundColor: "white" }
                }
              ></div>
            )
          )
        )}
      </div>
      {direction}
    </>
  );
}
export default GameBoard;
