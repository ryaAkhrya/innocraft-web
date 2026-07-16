"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useMockCmsState } from "./cms-storage";
import {
  defaultStudioSettingsData,
  type StudioSettingsData,
} from "./mock-settings";

const STORAGE_KEY = "studio.settings.mock";

const SettingsContext = createContext<StudioSettingsData>(defaultStudioSettingsData);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { value: saved } = useMockCmsState<StudioSettingsData>({
    storageKey: STORAGE_KEY,
    defaultValue: defaultStudioSettingsData,
  });

  const data = saved.websiteName ? saved : defaultStudioSettingsData;

  return (
    <SettingsContext.Provider value={data}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}