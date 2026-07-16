"use client";

import { useEffect, useState } from "react";

export function useMockCmsState<T>(opts: {
  storageKey: string;
  defaultValue: T;
}) {
  const { storageKey, defaultValue } = opts;

  // Hydration-safe initial value: always default on first render.
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        setValue(defaultValue);
        setIsLoaded(true);
        return;
      }
      setValue(JSON.parse(raw) as T);
    } catch {
      setValue(defaultValue);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  const save = (next: T) => {
    setValue(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  };

  return { value, setValue, save, isLoaded };
}

