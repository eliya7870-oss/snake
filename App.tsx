import { useAtomValue } from "jotai";
import "./App.css";
import GameBoard from "./components/GameBoard/GameBoard";
import { scoreAtom } from "./store/atoms";

function App() {
  const score = useAtomValue(scoreAtom);
  return (
    <div>
      <h1>score:{score.score}</h1>
      <h1>highscore:{score.highscore}</h1>
      <GameBoard />
    </div>
  );
}

export default App;
