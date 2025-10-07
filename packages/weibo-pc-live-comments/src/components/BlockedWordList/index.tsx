import "./index.css";
import { useBlockedWords } from "../../hooks";
import BlcokedWordItem from "./BlockedWordItem";

export default function BlcokedWordList() {
  const [blockedWords, { removeBlockedWord, clearBlockedWords }] =
    useBlockedWords();

  const handleClear = (word: string) => {
    removeBlockedWord(word);
  };

  const handleClearAll = () => {
    clearBlockedWords();
  };

  return blockedWords.length > 0 ? (
    <>
      <ul className="blocked-word-list">
        {blockedWords.map((word, index) => (
          <BlcokedWordItem
            key={word}
            word={word}
            index={index + 1}
            onClear={handleClear}
          ></BlcokedWordItem>
        ))}
      </ul>
      <div className="clear-blocked-words">
        <a onClick={handleClearAll}>清空屏蔽词</a>
      </div>
    </>
  ) : (
    <div className="no-blocked-words">当前暂未设置屏蔽词</div>
  );
}
