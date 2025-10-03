import { createLocalStorageStore } from "./createLocalStorageStore";

export const blockedWordsStore = createLocalStorageStore<string[]>(
  "blockedWords",
  [],
);

export function addBlockedWord(word: string) {
  blockedWordsStore.setValue((prev) => {
    const trimedWord = word.trim();
    if (!trimedWord) return prev;
    const newWords = Array.from(new Set([trimedWord, ...prev]));
    return newWords;
  });
}

export function removeBlockedWord(word: string) {
  blockedWordsStore.setValue((prev) => prev.filter((w) => w !== word));
}

export function clearBlockedWords() {
  blockedWordsStore.setValue([]);
}
