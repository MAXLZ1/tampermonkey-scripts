import { commentSwitchStore } from "../stores";

export function useCommentSwitch(): [boolean, (value: boolean) => void] {
  return [commentSwitchStore.useStore(), commentSwitchStore.setValue];
}
