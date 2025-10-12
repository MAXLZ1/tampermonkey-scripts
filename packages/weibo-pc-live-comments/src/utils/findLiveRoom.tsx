import { getLiveInfoDetail, getMyMBlog } from "../apis";
import { message } from "../components/WMessage/message";
import { MBlog } from "../types/mblog";
import { RoomInfoResponse } from "../types/response";
import { sleep } from "./sleep";
import BeginLiveMessage from "../components/BeginLiveMessage";
import FindLiveRoomMessage from "../components/FindLiveRoomMessage";
import LiveRoomNotFoundMessage from "../components/LiveRoomNotFoundMessage";
import { globalSettingStore } from "../stores";

async function findLiveRoom(blogs: MBlog[]) {
  const liveRooms = blogs.find((item) => item.page_info?.type === "26");

  if (!liveRooms) return null;

  const liveInfoDetail = await getLiveInfoDetail(
    liveRooms.page_info!.media_info.live_id,
  );

  if (liveInfoDetail?.status === 1) {
    return liveRooms.url_struct[0].long_url;
  }

  return null;
}

export async function launchLiveRoom(user: RoomInfoResponse["data"]["user"]) {
  const { autoRedirectLive, autoSearchLive } =
    globalSettingStore.getGlobalSetting();

  if (autoSearchLive) {
    const { uid } = user;
    message.loading({
      content: <FindLiveRoomMessage user={user} />,
      id: "launch live room",
      duration: 0,
    });

    await sleep(3000);
    const mBlog = await getMyMBlog(uid);

    if (!mBlog) return;

    const href = await findLiveRoom(mBlog.list);

    if (href) {
      if (autoRedirectLive) {
        window.location.href = href;
      } else {
        message.info({
          content: (
            <BeginLiveMessage liveHref={href} user={user} countdown={15} />
          ),
          id: "launch live room",
          duration: 15,
        });
      }
    } else {
      message.error({
        content: <LiveRoomNotFoundMessage user={user} />,
        id: "launch live room",
        duration: 5,
      });
    }
  }
}
