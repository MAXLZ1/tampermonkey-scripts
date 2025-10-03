import { blockedWordsStore } from "../stores";
import type { Comment } from "../types/comment";

export function extractDisplayComments(comments: Array<Comment>) {
  const res: Array<Comment> = [];
  for (let i = 0; i < comments.length; i++) {
    if (!skipComment(comments[i])) {
      res.unshift(comments[i]);
    }
  }

  return res;
}

export function skipComment(comment: Comment) {
  const blockedWords = blockedWordsStore.getSnapshot();
  return (
    blockedWords.length > 0 &&
    blockedWords.some((word) => {
      if (!word || !comment) return false;
      try {
        return new RegExp(word, "i").test(comment.text_raw);
      } catch (e) {
        // 非法正则，降级为字符串includes
        return comment.text_raw.includes(word);
      }
    })
  );
}
