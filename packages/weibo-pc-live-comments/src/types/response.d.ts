import { Comment } from "./comment";

export interface CommentsResponse {
  total_number: number;
  trendsText: string;
  data: Array<Comment>;
  max_id: number;
  ok: number;
}

export interface RoomInfo {
  code: number;
  msg: string;
  error_code: number;
  data: {
    liveId: string;
    status: number;
    cover: string;
    startTime: number;
    endTime: number;
    width: number;
    height: number;
    mid: string;
    title: string;
    watch_limit: number;
    user: {
      uid: number;
      screenName: string;
      profileImageUrl: string;
      verified: number;
      verifiedType: number;
      verifiedTypeExt: number;
      userAuthType: number;
      avatar: string;
      gender: string;
    };
    following: number;
    reposts_count: number;
    comments_count: number;
    attitudes_count: number;
    friends_count: number;
    liked: boolean;
    live_origin_hls_url: string;
    live_origin_flv_url: string;
    replay_origin_url: string;
    pay_live_status: number;
    play_switch: number;
  };
}
