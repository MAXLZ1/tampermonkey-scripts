import "./BlockedWordItem.css";
import TrashSVG from "../../assets/trash.svg?react";

type BlcokedWordItemProps = {
  word: string;
  onClear?: (word: string) => void;
  index?: number;
};

export default function BlcokedWordItem({
  word,
  onClear,
  index,
}: BlcokedWordItemProps) {
  const handleClick = () => {
    onClear && onClear(word);
  };

  return (
    <li className="blocked-word-item">
      <div className="blocked-word-item-left">
        <span>{index}.</span>
        <span className="blocked-word-text">{word}</span>
      </div>
      <TrashSVG className="clear" onClick={handleClick} />
    </li>
  );
}
