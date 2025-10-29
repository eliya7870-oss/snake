import "./GameBoard.css";
import { useAtom } from "jotai";
import { gameboardAtom } from "../../store/atoms";
import { useEffect, useRef, useState } from "react";
import { GAMEBOARD_SIZE } from "../../utils/constants";
import { random } from "../../functions/functions";

function GameBoard() {
  const [board, setBoard] = useAtom(gameboardAtom);
  const [direction, setDirection] = useState<string>("left");
  const [gameOver, setGameOver] = useState<boolean>(false);
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
  const generatefruitcoords = () => {
    while (true) {
      const coord = [random(GAMEBOARD_SIZE), random(GAMEBOARD_SIZE)];
      if (!snake.current.some(([x, y]) => x === coord[0] && y === coord[1])) {
        return coord;
      }
    }
  };
  const move = () => {
    const tmpBoard = board.map((r) => [...r]);
    let tmp = snake.current[0];
    // console.log(`fruit:${generatefruitcoords()}`);
    switch (directionRef.current) {
      case "up":
        if (tmp[0] <= 0) {
          setGameOver(true);
          break;
        }
        tmpBoard[tmp[0]][tmp[1]] = "";
        if (tmpBoard[tmp[0] - 1][tmp[1]] == "fruit") {
          const [a, b] = generatefruitcoords();
          tmpBoard[a][b] = "fruit";
        }
        tmpBoard[tmp[0] - 1][tmp[1]] = "up";
        snake.current[0] = [snake.current[0][0] - 1, snake.current[0][1]];
        break;
      case "down":
        if (tmp[0] >= GAMEBOARD_SIZE - 1) {
          setGameOver(true);
          break;
        }
        tmpBoard[tmp[0]][tmp[1]] = "";
        tmpBoard[tmp[0] + 1][tmp[1]] = "down";
        snake.current[0] = [snake.current[0][0] + 1, snake.current[0][1]];
        break;
      case "left":
        if (tmp[1] <= 0) {
          setGameOver(true);
          break;
        }
        tmpBoard[tmp[0]][tmp[1]] = "";
        tmpBoard[tmp[0]][tmp[1] - 1] = "left";
        snake.current[0] = [snake.current[0][0], snake.current[0][1] - 1];
        break;
      case "right":
        if (tmp[1] >= GAMEBOARD_SIZE - 1) {
          setGameOver(true);
          break;
        }
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
    // updateCell(snake.current[0][0], snake.current[0][1], "right");
    // updateCell(snake.current[1][0], snake.current[1][1], "body");
    // updateCell(snake.current[2][0], snake.current[2][1], "body");
    const [a, b] = generatefruitcoords();
    updateCell(a, b, "fruit");
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
  return gameOver ? (
    <>
      gameover!!<h1>score:{score}</h1>
    </>
  ) : (
    <>
      <div
        className="game-board"
        style={{ "--board-size": GAMEBOARD_SIZE } as React.CSSProperties}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, cellIndex) =>
            cell == "right" ||
            cell == "left" ||
            cell == "up" ||
            cell == "down" ? (
              <div className="head"></div>
            ) : cell == "body" ? (
              <div className="body"></div>
            ) : cell == "fruit" ? (
              <div className="fruit"></div>
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
      <p>
        {direction} score:{score}
      </p>
    </>
  );
}
export default GameBoard;
