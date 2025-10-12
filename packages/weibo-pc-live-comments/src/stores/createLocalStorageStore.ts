import { useSyncExternalStore } from "react";

type Listener<T> = (newValue: T) => void;

export function createLocalStorageStore<T>(key: string, initialValue: T) {
  if (localStorage.getItem(key) === null) {
    localStorage.setItem(key, JSON.stringify(initialValue));
  }

  const listeners = new Set<Listener<T>>();
  // 缓存 snapshot 避免 infinite loop
  let lastSnapshot: T = read();

  function read(): T {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  }

  function subscribe(listener: Listener<T>) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key)
        listeners.forEach((l) =>
          l((e.newValue ? JSON.parse(e.newValue) : {}) as T),
        );
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function getSnapshot(): T {
    const next = read();
    if (JSON.stringify(next) !== JSON.stringify(lastSnapshot)) {
      lastSnapshot = next;
    }
    return lastSnapshot;
  }

  function setValue(value: T | ((prev: T) => T)) {
    const newValue = value instanceof Function ? value(getSnapshot()) : value;
    localStorage.setItem(key, JSON.stringify(newValue));
    listeners.forEach((l) => l(newValue));
  }

  return {
    subscribe,
    useStore: () => useSyncExternalStore(subscribe, getSnapshot),
    setValue,
    getSnapshot,
  };
}
