import { blockedWordsStore } from "../stores";
import type { Comment } from "../types/comment";

let newestId = -1;

export function extractDisplayComments(comments: Array<Comment>) {
  let completed = false;
  const res: Array<Comment> = [];
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];

    if (completed) break;

    if (!(completed = comment.id === newestId) && !skipComment(comment)) {
      res.unshift(comment);
    }
  }

  res.length > 0 && (newestId = res[res.length - 1].id);

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
