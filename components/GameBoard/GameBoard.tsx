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
  const intervalRef = useRef<number | undefined>(undefined);

  const [snake, setSnake] = useState([
    [10, 10],
    [10, 11],
    [10, 12],
  ]);
  const snakeRef = useRef(snake);

  // Function to generate fruit coordinates, avoiding the snake
  const generatefruitcoords = (currentSnake: number[][]) => {
    let attempts = 0;
    const maxAttempts = 1000; // Prevent infinite loop

    while (attempts < maxAttempts) {
      const coord = [random(GAMEBOARD_SIZE), random(GAMEBOARD_SIZE)];
      const isOnSnake = currentSnake.some(
        ([x, y]) => x === coord[0] && y === coord[1]
      );

      if (!isOnSnake) {
        console.log(coord);
        return coord;
      }
      attempts++;
    }

    // Fallback: find any empty cell
    for (let row = 0; row < GAMEBOARD_SIZE; row++) {
      for (let col = 0; col < GAMEBOARD_SIZE; col++) {
        if (!currentSnake.some(([x, y]) => x === row && y === col)) {
          return [row, col];
        }
      }
    }

    // Should never reach here unless board is full
    return [0, 0];
  };

  const [fruit, setFruit] = useState<number[]>(() =>
    generatefruitcoords([
      [10, 10],
      [10, 11],
      [10, 12],
    ])
  );
  const fruitRef = useRef(fruit);

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

    // Wall collision
    if (
      newHead[0] < 0 ||
      newHead[0] >= GAMEBOARD_SIZE ||
      newHead[1] < 0 ||
      newHead[1] >= GAMEBOARD_SIZE
    ) {
      setGameOver(true);
      clearInterval(intervalRef.current);
      return;
    }

    // Self collision
    if (
      snakeRef.current.some(([x, y]) => x === newHead[0] && y === newHead[1])
    ) {
      setGameOver(true);
      clearInterval(intervalRef.current);
      return;
    }

    // Check if fruit is eaten
    const fruitEaten =
      newHead[0] === fruitRef.current[0] && newHead[1] === fruitRef.current[1];

    let newSnake: number[][];
    if (fruitEaten) {
      // Grow snake by keeping tail
      newSnake = [newHead, ...snakeRef.current];
      setScore((prev) => prev + 1);

      // Generate new fruit position that avoids the NEW snake
      const newFruitCoord = generatefruitcoords(newSnake);

      // CRITICAL: Update ref immediately to prevent race condition
      fruitRef.current = newFruitCoord;
      setFruit(newFruitCoord);
    } else {
      // Move snake by removing tail
      newSnake = [newHead, ...snakeRef.current.slice(0, -1)];
    }

    // Update snake ref immediately as well
    snakeRef.current = newSnake;
    setSnake(newSnake);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          if (directionRef.current !== "down") {
            setDirection("up");
          }
          break;
        case "ArrowDown":
          if (directionRef.current !== "up") {
            setDirection("down");
          }
          break;
        case "ArrowLeft":
          if (directionRef.current !== "right") {
            setDirection("left");
          }
          break;
        case "ArrowRight":
          if (directionRef.current !== "left") {
            setDirection("right");
          }
          break;
      }
    };

    intervalRef.current = setInterval(() => {
      move();
    }, 150);

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    fruitRef.current = fruit;
  }, [fruit]);

  return (
    <>
      <div
        className="game-board"
        style={{ "--board-size": GAMEBOARD_SIZE } as React.CSSProperties}
      >
        {gameOver && (
          <div className="gameover-overlay">
            <h1 className="gameover-title">game over</h1>
            <p className="gameover-score">score:{score}</p>
            <button
              className="gameover-button"
              onClick={() => {
                setGameOver(false);
                setScore(0);
                setSnake([
                  [10, 10],
                  [10, 11],
                  [10, 12],
                ]);

                intervalRef.current = intervalRef.current = setInterval(() => {
                  move();
                }, 150);
              }}
            >
              try again
            </button>
          </div>
        )}
        {board.map((row, rowIndex) =>
          row.map((_, cellIndex) => {
            const isFruit =
              fruitRef.current[0] === rowIndex &&
              fruitRef.current[1] === cellIndex;
            const snakeIndex = snake.findIndex(
              ([sr, sc]) => sr === rowIndex && sc === cellIndex
            );

            return snakeIndex === 0 ? (
              <div key={`${rowIndex}-${cellIndex}`} className="head"></div>
            ) : snakeIndex > 0 ? (
              <div key={`${rowIndex}-${cellIndex}`} className="body"></div>
            ) : isFruit ? (
              <div key={`${rowIndex}-${cellIndex}`} className="fruit"></div>
            ) : (
              <div
                key={`${rowIndex}-${cellIndex}`}
                className="cell"
                style={
                  (rowIndex + cellIndex) % 2 === 0
                    ? { backgroundColor: "#adb5bd" }
                    : { backgroundColor: "white" }
                }
              ></div>
            );
          })
        )}
      </div>
    </>
  );
}

export default GameBoard;
