import { useEffect, useState } from "react";
import type { Comment } from "../types/comment";
import { commentsStore } from "../stores";

// 找增量弹幕的 Hook
export function useIncrementalComments() {
  const [added, setAdded] = useState<Comment[]>([]);

  useEffect(() => {
    const unsubscribe = commentsStore.subscribe((newAdded) => {
      setAdded(newAdded);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return added;
}
