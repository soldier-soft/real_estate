import React, { createContext, useContext, useEffect, useState } from "react";
import { api, WebsiteSettings } from "../services/api";

interface SettingsContextType {
  settings: WebsiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<WebsiteSettings>) => Promise<boolean>;
}

const defaultSettings: WebsiteSettings = {
  company_name: "Sri Chakra Real Estate",
  contact_phone: "+91 97915 46491",
  whatsapp_number: "+91 97915 46491",
  office_location: "Tamil Nadu, India",
  contact_email: "info@srichakrarealestate.in",
  logo_text: "Sri Chakra",
  contact_button_text: "Call Now for Best Offer",
  banner_badge_text: "500+ Happy Clients ✓",
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: false,
  refreshSettings: async () => {},
  updateSettings: async () => false,
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshSettings = async () => {
    try {
      const res = await api.settings.getSettings();
      if (res.data.success && res.data.settings) {
        setSettings((prev) => ({
          ...prev,
          ...res.data.settings,
        }));
      }
    } catch {
      // Fallback to default if network / server offline
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<WebsiteSettings>): Promise<boolean> => {
    try {
      const res = await api.settings.updateSettings(newSettings);
      if (res.data.success && res.data.settings) {
        setSettings((prev) => ({
          ...prev,
          ...res.data.settings,
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
