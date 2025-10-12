import { globalSettingStore } from "../stores";

export function useGlobalSetting() {
  const value = globalSettingStore.useGlobalSetting();
  return [value, globalSettingStore.setGlobalSetting] as const;
}
