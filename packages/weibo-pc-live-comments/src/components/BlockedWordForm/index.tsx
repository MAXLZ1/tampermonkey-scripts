import "./index.css";
import WButton from "../WButton";
import WInput from "../WInput";
import { useState } from "react";
import { useBlockedWords } from "../../hooks";

export default function BlockedWordForm() {
  const [blockedWord, setBlockedWord] = useState("");
  const [, { addBlockedWord }] = useBlockedWords();
  function handleBlockedWordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBlockedWord(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // 阻止页面刷新
    if (!blockedWord.trim()) return;

    addBlockedWord(blockedWord);
    setBlockedWord(""); // 添加成功后清空输入框
  }

  return (
    <form className="blocked-word-form" onSubmit={handleSubmit}>
      <WInput
        className="blocked-word-input"
        placeholder="请输入关键字（支持正则表达式）"
        name="filterWord"
        type="text"
        value={blockedWord}
        onChange={handleBlockedWordChange}
      />
      <WButton type="submit">添加屏蔽词</WButton>
    </form>
  );
}
