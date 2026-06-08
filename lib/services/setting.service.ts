import { API_URL, getAuthHeaders } from "@/lib/api";

const SETTINGS_URL = `${API_URL}/settings`;

export const SettingService = {
  async getSettings() {
    const res = await fetch(SETTINGS_URL);
    if (!res.ok) throw new Error("Failed to fetch settings");
    return res.json();
  },

  async updateSettings(data: Record<string, unknown>) {
    const res = await fetch(SETTINGS_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update settings");
    return res.json();
  },
};
