import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Download, Code } from "lucide-react";
import SourceToggle from "@/components/SourceToggle";
import VideoForm from "@/components/VideoForm";
import VideoPreview from "@/components/VideoPreview";
import { useVideoDownloader } from "@/hooks/use-video-downloader";

export type VideoSource = "tiktok" | "instagram";

export default function Home() {
  const [videoSource, setVideoSource] = useState<VideoSource>("tiktok");
  const { toast } = useToast();
  const {
    isLoading,
    videoData,
    error,
    filename,
    downloadVideo,
    resetState
  } = useVideoDownloader();

  const handleSourceChange = (source: VideoSource) => {
    setVideoSource(source);
    resetState();
  };

  const handleSubmit = async (url: string) => {
    try {
      await downloadVideo(url, videoSource);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    }
  };
  
  const downloadSourceCode = () => {
    try {
      toast({
        title: "Downloading Source Code",
        description: "Preparing source code as ZIP file...",
      });
      
      // Create a hidden download link
      const link = document.createElement('a');
      link.href = '/api/download/source';
      link.download = 'rcdl-source.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading source code:", err);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "There was an error downloading the source code. Please try again."
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <header className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            RCDL
          </h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>
        <p className="text-gray-600">
          Download TikTok & Instagram videos without watermark
        </p>
      </header>

      {/* Downloader Card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <SourceToggle 
            currentSource={videoSource} 
            onSourceChange={handleSourceChange} 
          />
          
          <VideoForm 
            videoSource={videoSource} 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
          />
          
          {error && (
            <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg mt-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-red-500" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video Preview */}
      {videoData && (
        <VideoPreview 
          videoUrl={videoData} 
          filename={filename}
          source={videoSource}
        />
      )}

      {/* Hidden Source Code Download - Only visible to admin */}

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} RCDL Video Downloader. All rights reserved.</p>
        <p className="mt-1">Not affiliated with TikTok or Instagram.</p>
      </footer>

      <Toaster />
    </div>
  );
}
