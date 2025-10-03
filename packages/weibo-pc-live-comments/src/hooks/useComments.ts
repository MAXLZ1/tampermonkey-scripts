import { useSyncExternalStore } from "react";
import { commentsStore } from "../stores";

export function useComments() {
  return useSyncExternalStore(
    commentsStore.subscribe,
    commentsStore.getComments,
  );
}
