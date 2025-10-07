import { useEffect, useState } from "react";
import "./index.css";

export default function VideoBackground() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const posterDom = document.querySelector<HTMLDivElement>(".wbpv-poster");
    if (posterDom) {
      const matches =
        posterDom.style.backgroundImage.match(/http(s?).*(?="\))/);

      if (matches?.[0]) {
        setUrl(matches[0]);
      }
    }
  }, []);

  return (
    <div
      className="video-background"
      style={{ backgroundImage: `url(${url})` }}
    />
  );
}
