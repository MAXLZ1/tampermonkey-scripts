import type {
  CommentsResponse,
  LiveInfoDetailResponse,
  MyMBloygResponse,
  RoomInfoResponse,
} from "../types/response";
import { sleep } from "../utils";

export async function getRoomInfo(liveId: string) {
  const res = await fetch(
    `https://weibo.com/l/!/2/wblive/room/show_pc_live.json?live_id=${liveId}`,
  );
  if (res) {
    const { data } = (await res.json()) as RoomInfoResponse;
    return data;
  }
  return null;
}

export async function getComments(mid: string, uid: number, isFirst?: boolean) {
  if (!isFirst) {
    await sleep(Math.random() * Number(import.meta.env.VITE_MAX_RANDOM_GAP));
  }

  const res = await fetch(
    `https://weibo.com/ajax/statuses/buildComments?flow=1&is_reload=1&id=${mid}&is_show_bulletin=2&is_mix=0&max_id=0&count=20&uid=${uid}&fetch_level=0&locale=zh-CN&expand_text=0`,
  );
  if (res.ok) {
    const { data } = (await res.json()) as CommentsResponse;
    return data;
  } else {
    return [];
  }
}

export async function getMyMBlog(uid: number) {
  const res = await fetch(
    `https://weibo.com/ajax/statuses/mymblog?uid=${uid}&page=1&feature=0`,
  );

  if (res.ok) {
    const { data } = (await res.json()) as MyMBloygResponse;
    return data;
  }

  return null;
}

export async function getLiveInfoDetail(liveId: string) {
  const res = await fetch(
    `https://weibo.com/ajax/multimedia/getLiveInfoDetail?live_id=${liveId}`,
  );
  if (res.ok) {
    const { data } = (await res.json()) as LiveInfoDetailResponse;
    return data;
  }
  return null;
}
