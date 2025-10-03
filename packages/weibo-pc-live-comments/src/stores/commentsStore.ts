import { createCommentsStore } from "./createCommentsStore";
import type { Comment } from "../types/comment";

export const commentsStore = createCommentsStore();

// 组件外更新函数
export const addComments = (newComments: Comment[]) => {
  commentsStore.setComments(newComments);
};
