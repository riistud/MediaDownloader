import { apiRequest } from "./queryClient";

interface ApiResponse {
  status: boolean;
  result: {
    video_nowm?: string;
    video?: string;
  };
}

export async function fetchTikTokVideo(url: string): Promise<string> {
  try {
    const response = await apiRequest("GET", `/api/download/tiktok?url=${encodeURIComponent(url)}`, undefined);
    
    const data: ApiResponse = await response.json();
    
    if (!data.status) {
      throw new Error("Failed to retrieve video");
    }
    
    if (!data.result.video_nowm) {
      throw new Error("Video URL not found in the API response");
    }
    
    return data.result.video_nowm;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An error occurred while fetching the TikTok video");
  }
}

export async function fetchInstagramVideo(url: string): Promise<string> {
  try {
    const response = await apiRequest("GET", `/api/download/instagram?url=${encodeURIComponent(url)}`, undefined);
    
    const data: ApiResponse = await response.json();
    
    if (!data.status) {
      throw new Error("Failed to retrieve video");
    }
    
    if (!data.result.video) {
      throw new Error("Video URL not found in the API response");
    }
    
    return data.result.video;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An error occurred while fetching the Instagram video");
  }
}
