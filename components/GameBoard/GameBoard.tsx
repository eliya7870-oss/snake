import "./GameBoard.css";
import { useAtom } from "jotai";
import { gameboardAtom } from "../../store/atoms";
import { useEffect, useRef, useState } from "react";

function GameBoard() {
  const [board, setBoard] = useAtom(gameboardAtom);
  const [direction, setDirection] = useState<string>("left");
  const [score, setScore] = useState(0);
  const directionRef = useRef(direction);
  const snake = useRef([
    [10, 10],
    [10, 11],
    [10, 12],
  ]);
  const updateCell = (row: number, col: number, value: string) => {
    setBoard((prevBoard) =>
      prevBoard.map((r, rowIndex) =>
        rowIndex === row
          ? r.map((cell, colIndex) => (colIndex === col ? value : cell))
          : r
      )
    );
  };
  const move = () => {
    const tmpBoard = board.map((r) => [...r]);
    let tmp = snake.current[0];
    switch (directionRef.current) {
      case "up":
        tmpBoard[tmp[0]][tmp[1]] = "";
        tmpBoard[tmp[0] - 1][tmp[1]] = "up";
        snake.current[0] = [snake.current[0][0] - 1, snake.current[0][1]];
        break;
      case "down":
        tmpBoard[tmp[0]][tmp[1]] = "";
        tmpBoard[tmp[0] + 1][tmp[1]] = "down";
        snake.current[0] = [snake.current[0][0] + 1, snake.current[0][1]];
        break;
      case "left":
        tmpBoard[tmp[0]][tmp[1]] = "";
        tmpBoard[tmp[0]][tmp[1] - 1] = "left";
        snake.current[0] = [snake.current[0][0], snake.current[0][1] - 1];
        break;
      case "right":
        tmpBoard[tmp[0]][tmp[1]] = "";
        tmpBoard[tmp[0]][tmp[1] + 1] = "right";
        snake.current[0] = [snake.current[0][0], snake.current[0][1] + 1];
        break;
    }
    snake.current = snake.current.map((node, index) => {
      console.log(node);
      if (index == 0) {
        return node;
      }
      tmpBoard[node[0]][node[1]] = "";
      [node, tmp] = [tmp, node];
      tmpBoard[node[0]][node[1]] = "body";

      return node;
    });
    setBoard(tmpBoard);
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
    updateCell(snake.current[0][0], snake.current[0][1], "right");
    updateCell(snake.current[1][0], snake.current[1][1], "body");
    updateCell(snake.current[2][0], snake.current[2][1], "body");
    const intervalId = setInterval(() => {
      move();
    }, 500);
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
            ) : cell == "body" ? (
              <div className="body"></div>
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
