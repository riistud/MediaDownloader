import { useState } from "react";
import { fetchTikTokVideo, fetchInstagramVideo } from "@/lib/api";
import { VideoSource } from "@/pages/Home";

export function useVideoDownloader() {
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("");

  const resetState = () => {
    setVideoData(null);
    setError(null);
  };

  const generateRandomFilename = (): string => {
    // Generate alphanumeric string for the filename
    const randomString = Math.random().toString(36).substring(2, 10);
    // Add some numbers to make it more like the format mentioned (rcdl-stringangka.mp4)
    const randomNumbers = Math.floor(Math.random() * 9000000000) + 1000000000;
    return `rcdl-${randomString}${randomNumbers}.mp4`;
  };

  const validateUrl = (url: string, source: VideoSource): boolean => {
    if (source === "tiktok" && !url.includes("tiktok.com")) {
      setError("Please enter a valid TikTok URL");
      return false;
    }
    
    if (source === "instagram" && !url.includes("instagram.com")) {
      setError("Please enter a valid Instagram URL");
      return false;
    }
    
    return true;
  };

  const downloadVideo = async (url: string, source: VideoSource) => {
    resetState();
    
    if (!validateUrl(url, source)) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const videoUrl = source === "tiktok" 
        ? await fetchTikTokVideo(url)
        : await fetchInstagramVideo(url);
      
      const newFilename = generateRandomFilename();
      setFilename(newFilename);
      setVideoData(videoUrl);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    videoData,
    error,
    filename,
    downloadVideo,
    resetState,
  };
}
