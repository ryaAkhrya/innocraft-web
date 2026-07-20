"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../supabase/client";
import {
  defaultStudioSettingsData,
  type StudioSettingsData,
} from "./mock-settings";

function toSettingsData(row: {
  website_name: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  footer_text: string | null;
  seo_title: string | null;
  seo_description: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
}): StudioSettingsData {
  return {
    websiteName: row.website_name ?? "",
    logoUrl: row.logo_url ?? "",
    faviconUrl: row.favicon_url ?? "",
    footerText: row.footer_text ?? "",
    seoTitle: row.seo_title ?? "",
    seoDescription: row.seo_description ?? "",
    instagramUrl: row.instagram ?? "",
    facebookUrl: row.facebook ?? "",
    tiktokUrl: row.tiktok ?? "",
  };
}

const SettingsContext = createContext<StudioSettingsData>(defaultStudioSettingsData);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StudioSettingsData>(defaultStudioSettingsData);

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("id, website_name, logo_url, favicon_url, footer_text, seo_title, seo_description, instagram, facebook, tiktok")
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          console.error("Failed to load settings:", error.message, error.code, error.details);
          return;
        }

        if (data) {
          setSettings(toSettingsData(data));
        }
        // If no data, keep defaults
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    }

    loadSettings();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}