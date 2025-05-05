import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VideoSource } from "@/pages/Home";

interface VideoPreviewProps {
  videoUrl: string;
  filename: string;
  source: VideoSource;
}

export default function VideoPreview({ videoUrl, filename, source }: VideoPreviewProps) {
  // Function to handle direct download without opening in new tab
  const handleDownload = () => {
    // Force filename format as rcdl-stringangka.mp4 to replace any original name
    const link = document.createElement('a');
    link.href = videoUrl;
    // Ensure filename follows the rcdl-stringangka.mp4 pattern
    link.download = filename;
    
    // Log download event with custom filename
    console.log(`Downloading video as: ${filename}`);
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Video Preview</h2>
      <Card className="overflow-hidden">
        <div className="relative aspect-video">
          <video
            className="w-full h-full object-contain bg-black"
            src={videoUrl}
            controls
          />
        </div>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                From: {source === "tiktok" ? "TikTok" : "Instagram"}
              </p>
              <p className="text-sm font-medium truncate">{filename}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {/* Direct download button */}
              <Button 
                onClick={handleDownload}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition duration-200 text-center flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
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
                <span>Download Video</span>
              </Button>
              
              {/* Save link (opens in new tab) */}
              <a
                href={videoUrl}
                download={filename}
                target="_blank"
                rel="noopener noreferrer"
                className="flex"
              >
                <Button 
                  className="bg-success hover:bg-success/90 text-white px-6 py-2.5 rounded-lg font-medium transition duration-200 text-center flex items-center justify-center w-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
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
                  <span>Save Video</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
