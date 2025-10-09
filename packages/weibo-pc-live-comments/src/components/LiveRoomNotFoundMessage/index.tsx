import { RoomInfoResponse } from "../../types/response";
import WLink from "../WLink";

type FindLiveRoomMessageProps = {
  user: RoomInfoResponse["data"]["user"];
};

export default function LiveRoomNotFoundMessage({
  user,
}: FindLiveRoomMessageProps) {
  const { uid, screenName } = user;

  return (
    <span>
      未找到新的直播间，【
      <WLink href={`https://weibo.com/u/${uid}`} target="_blank">
        {screenName}
      </WLink>
      】可能未开播。
    </span>
  );
}
