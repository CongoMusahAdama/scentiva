const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/settings`;

const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
});

export const SettingService = {
  async getSettings() {
    const res = await fetch(API_URL, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch settings");
    return res.json();
  },

  async updateSettings(data: any) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update settings");
    return res.json();
  }
};
