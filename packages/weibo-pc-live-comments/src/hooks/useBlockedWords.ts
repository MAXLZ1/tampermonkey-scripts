import { blockedWordsStore } from "../stores";
import {
  addBlockedWord,
  removeBlockedWord,
  clearBlockedWords,
} from "../stores/blockedWordsStore";

export function useBlockedWords(): [
  string[],
  {
    addBlockedWord: (word: string) => void;
    removeBlockedWord: (word: string) => void;
    clearBlockedWords: () => void;
  },
] {
  const value = blockedWordsStore.useStore();
  return [value, { addBlockedWord, removeBlockedWord, clearBlockedWords }];
}
