import { RoomInfoResponse } from "../../types/response";
import WLink from "../WLink";

type FindLiveRoomMessageProps = {
  user: RoomInfoResponse["data"]["user"];
};

export default function FindLiveRoomMessage({
  user,
}: FindLiveRoomMessageProps) {
  const { uid, screenName } = user;

  return (
    <span>
      正在寻找【
      <WLink href={`https://weibo.com/u/${uid}`} target="_blank">
        {screenName}
      </WLink>
      】的新直播间。
    </span>
  );
}
