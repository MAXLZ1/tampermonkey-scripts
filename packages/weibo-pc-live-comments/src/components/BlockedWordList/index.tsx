import "./index.css";
import { useBlockedWords } from "../../hooks";
import BlcokedWordItem from "./BlockedWordItem";
import WButton from "../WButton";

export default function BlcokedWordList() {
  const [blockedWords, { removeBlockedWord, clearBlockedWords }] =
    useBlockedWords();

  const handleClear = (word: string) => {
    removeBlockedWord(word);
  };

  const handleClearAll = () => {
    clearBlockedWords();
  };

  return (
    <div className="blocked-word-list">
      {blockedWords.map((word) => (
        <BlcokedWordItem
          key={word}
          word={word}
          onClear={handleClear}
        ></BlcokedWordItem>
      ))}
      {blockedWords.length > 0 && (
        <div className="clear-blocked-words">
          <WButton onClick={handleClearAll}>清空屏蔽词</WButton>
        </div>
      )}
    </div>
  );
}
