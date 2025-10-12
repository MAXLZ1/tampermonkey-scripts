import { commentSwitchStore } from "../stores";

export function useCommentSwitch() {
  return [commentSwitchStore.useStore(), commentSwitchStore.setValue] as const;
}
