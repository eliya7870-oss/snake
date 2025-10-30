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

  const [snake, setSnake] = useState([
    [10, 10],
    [10, 11],
    [10, 12],
  ]);
  const snakeRef = useRef(snake);
  const generatefruitcoords = () => {
    while (true) {
      const coord = [random(GAMEBOARD_SIZE), random(GAMEBOARD_SIZE)];
      if (
        !snakeRef.current.some(([x, y]) => x === coord[0] && y === coord[1])
      ) {
        return coord;
      }
    }
  };
  const [fruit, setFruit] = useState<number[]>(generatefruitcoords());
  const fruitRef = useRef(fruit);
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
    const head = snakeRef.current[0];
    let newHead = [...head];

    switch (directionRef.current) {
      case "up":
        newHead[0]--;
        break;
      case "down":
        newHead[0]++;
        break;
      case "left":
        newHead[1]--;
        break;
      case "right":
        newHead[1]++;
        break;
    }
    if (
      newHead[0] < 0 ||
      newHead[0] >= GAMEBOARD_SIZE ||
      newHead[1] < 0 ||
      newHead[1] >= GAMEBOARD_SIZE
    ) {
      setGameOver(true);
      return;
    }

    let newSnake = [];
    if (
      newHead[0] === fruitRef.current[0] &&
      newHead[1] === fruitRef.current[1]
    ) {
      setScore((prev) => prev + 1);
      setFruit(generatefruitcoords());
      newSnake = [newHead, ...snakeRef.current];
    } else {
      newSnake = [newHead, ...snakeRef.current.slice(0, -1)];
    }
    console.log(newSnake);
    setSnake(newSnake);

    console.log(`fruit: ${fruit}`);
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

    const intervalId = setInterval(() => {
      move();
    }, 250);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(intervalId);
    };
  }, []);
  useEffect(() => {
    directionRef.current = direction; // keep ref updated
    snakeRef.current = snake;
    fruitRef.current = fruit;
  }, [direction, snake, snake]);
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
          row.map((_, cellIndex) => {
            const isFruit =
              fruitRef.current[0] === rowIndex &&
              fruitRef.current[1] === cellIndex;
            const snakeIndex = snake.findIndex(
              ([sr, sc]) => sr === rowIndex && sc === cellIndex
            );
            return snakeIndex === 0 ? (
              <div className="head"></div>
            ) : snakeIndex > 0 ? (
              <div className="body"></div>
            ) : isFruit ? (
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
            );
          })
        )}
      </div>
      <p>
        {direction} score:{score}
      </p>
    </>
  );
}
export default GameBoard;
