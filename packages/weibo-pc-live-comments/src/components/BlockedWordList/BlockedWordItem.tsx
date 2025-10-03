import "./BlockedWordItem.css";
import ClearSvg from "../../assets/close.svg?react";

type BlcokedWordItemProps = {
  word: string;
  onClear?: (word: string) => void;
};

export default function BlcokedWordItem({
  word,
  onClear,
}: BlcokedWordItemProps) {
  const handleClick = () => {
    onClear && onClear(word);
  };

  return (
    <div className="blocked-word-item">
      <span>{word}</span>
      <div className="clear" onClick={handleClick}>
        <ClearSvg />
      </div>
    </div>
  );
}
