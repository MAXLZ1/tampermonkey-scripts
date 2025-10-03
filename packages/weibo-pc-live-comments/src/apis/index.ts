import type { CommentsResponse, RoomInfo } from "../types/response";
import { sleep } from "../utils/sleep";

export async function getMid(liveId: string) {
  const res = await fetch(
    `https://weibo.com/l/!/2/wblive/room/show_pc_live.json?live_id=${liveId}`,
  );
  if (res) {
    const { data } = (await res.json()) as RoomInfo;
    return data.mid;
  }
  return null;
}

export async function getComments(mid: string, maxRandomGap: number) {
  await sleep(Math.random() * maxRandomGap);

  const res = await fetch(
    `https://weibo.com/ajax/statuses/buildComments?flow=1&is_reload=1&id=${mid}&is_show_bulletin=2&is_mix=0&max_id=0&count=20&uid=6310707619&fetch_level=0&locale=zh-CN&expand_text=0`,
  );
  if (res.ok) {
    const { data } = (await res.json()) as CommentsResponse;
    return data;
  } else {
    return [];
  }
}
