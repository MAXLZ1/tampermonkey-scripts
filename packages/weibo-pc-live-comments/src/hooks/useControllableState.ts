import { useCallback, useRef, type SetStateAction } from "react";
import { useUpdate } from ".";

type Options<T> = {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
};

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: Options<T>) {
  const update = useUpdate();
  const isControlled = value !== undefined;
  const stateRef = useRef<T>(isControlled ? value : defaultValue);

  if (isControlled) {
    stateRef.current = value;
  }

  const setState = useCallback(
    (v: SetStateAction<T>) => {
      const nextValue =
        typeof v === "function"
          ? (v as (prev: T | undefined) => T)(stateRef.current)
          : v;
      if (nextValue === stateRef.current) return;

      if (!isControlled) {
        stateRef.current = nextValue;
        update();
      }

      onChange?.(nextValue);
    },
    [onChange, update],
  );

  return [stateRef.current, setState] as const;
}
