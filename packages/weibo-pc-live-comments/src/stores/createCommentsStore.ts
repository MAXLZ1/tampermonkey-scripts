import type { Comment } from "../types/comment";

type Subscriber = () => void;

export function createCommentsStore() {
  let comments: Comment[] = [];
  const subscribers = new Set<Subscriber>();

  const getComments = () => comments;

  const setComments = (newComments: Comment[]) => {
    // 去重
    comments = Array.from(
      new Map([...comments, ...newComments].map((c) => [c.id, c])).values(),
    ).slice(-Number(import.meta.env.VITE_MAX_COMMENTS_NUMBER));
    subscribers.forEach((sub) => sub());
  };

  const subscribe = (sub: Subscriber) => {
    subscribers.add(sub);
    return () => subscribers.delete(sub);
  };

  return { getComments, setComments, subscribe };
}
