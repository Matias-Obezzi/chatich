export async function getChannelData(channel: string) {
  try {
    const response = await fetch(`https://kick.com/api/v2/channels/${channel}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch channel data: ${response.statusText}`);
    }
    if (response?.status === 403) {
      throw new Error(
        "Request blocked by Cloudflare protection. Please try again later."
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting channel data:", error);
    return null;
  }
};