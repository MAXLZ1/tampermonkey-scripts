import type { Comment } from "../types/comment";
import { globalSettingStore } from "./globalSettingStore";

type Subscriber = (added: Comment[]) => void;

export function createCommentsStore() {
  let comments: Comment[] = [];
  const subscribers = new Set<Subscriber>();

  const getComments = () => comments;

  const setComments = (newComments: Comment[]) => {
    const { maxCommentsNum } = globalSettingStore.getGlobalSetting();

    const prevIds = new Set(comments.map((c) => c.id));
    // 去重
    const merged = Array.from(
      new Map([...comments, ...newComments].map((c) => [c.id, c])).values(),
    ).slice(-maxCommentsNum);

    // 计算新增
    const added = merged.filter((c) => !prevIds.has(c.id));

    if (added.length === 0) return;

    comments = merged;
    subscribers.forEach((sub) => sub(added));
  };

  const subscribe = (sub: Subscriber) => {
    subscribers.add(sub);
    return () => subscribers.delete(sub);
  };

  return { getComments, setComments, subscribe };
}
