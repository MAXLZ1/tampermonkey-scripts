import { useEffect, useState } from "react";
import WLink from "../WLink";
import { RoomInfoResponse } from "../../types/response";
import { motion } from "motion/react";

type BeginLiveMessageProps = {
  liveHref: string;
  user: RoomInfoResponse["data"]["user"];
  countdown?: number;
};

export default function BeginLiveMessage({
  liveHref,
  user,
  countdown = 5,
}: BeginLiveMessageProps) {
  const { uid, screenName } = user;
  const [seconds, setSeconds] = useState(countdown);

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((s) => {
        if (s <= 0) clearTimeout(timer);
        return s - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <>
      <span>
        【
        <WLink href={`https://weibo.com/u/${uid}`} target="_blank">
          {screenName}
        </WLink>
        】已开播！
      </span>
      <motion.a
        className="woo-button-main woo-button-flat woo-button-primary woo-button-s woo-button-round"
        style={{ marginLeft: 6, width: 130 }}
        href={liveHref}
        target="_self"
        animate={{ scale: [1, 1.08, 1], opacity: [1, 0.8, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        点我进入直播间 {seconds}
      </motion.a>
    </>
  );
}
