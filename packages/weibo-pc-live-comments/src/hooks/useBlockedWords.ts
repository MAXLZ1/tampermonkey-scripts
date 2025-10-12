import { blockedWordsStore } from "../stores";
import {
  addBlockedWord,
  removeBlockedWord,
  clearBlockedWords,
} from "../stores/blockedWordsStore";

export function useBlockedWords() {
  const value = blockedWordsStore.useStore();
  return [
    value,
    { addBlockedWord, removeBlockedWord, clearBlockedWords },
  ] as const;
}
