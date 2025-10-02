function bootstrap() {
  const title = document.querySelector(".livestream-container .title");
  if (title && title.textContent.includes("直播已结束")) {
    return;
  }

  document.body.style.width = "100%";

  window.addEventListener("load", function () {
    const playerEl = document.querySelector("#playerEl");
    if (!playerEl) {
      return;
    }

    const startDom = playerEl.querySelector<HTMLElement>(".xgplayer-start");
    const videoDom = playerEl.querySelector("video");
    const bottomButton = document.querySelector(
      ".fixed-bottom-button.live-fixed-bottom-button",
    );
    const poster = playerEl.querySelector<HTMLElement>(".xgplayer-poster");
    const livestreamContainer = document.querySelector(".livestream-container");

    if (livestreamContainer) {
      const callback = (mutationList: MutationRecord[]) => {
        mutationList.forEach((mutation) => {
          if (mutation.type === "childList") {
            const addedNodes = mutation.addedNodes;
            for (let index = 0; index < addedNodes.length; index++) {
              const node = addedNodes[index];
              if (
                node instanceof HTMLElement &&
                node.classList.contains("comment-container")
              ) {
                node.style.height = "500px";
                node.style.width = "30%";
                mutationObserver.disconnect();
              }
            }
          }
        });
      };
      const mutationObserver = new MutationObserver(callback);

      mutationObserver.observe(livestreamContainer, {
        attributes: false,
        subtree: false,
        childList: true,
      });
    }

    if (videoDom) {
      videoDom.style.objectFit = "contain";
    }

    startDom?.click();

    bottomButton?.remove();

    if (poster) {
      const matches = poster.style.backgroundImage.match(/http(s?).*(?="\))/);
      if (!matches) {
        return;
      }
      const img = matches[0];
      const backgroundPosterId = "backgroundPoster";

      if (!playerEl.querySelector(`#${backgroundPosterId}`)) {
        const backgroundDiv = document.createElement("div");
        backgroundDiv.id = backgroundPosterId;
        backgroundDiv.setAttribute(
          "style",
          `position: absolute; width: 100%; height: 100%; background: center / cover no-repeat url(${img}); filter: blur(30px);`,
        );
        playerEl.appendChild(backgroundDiv);
      }
    }
  });
}

bootstrap();
