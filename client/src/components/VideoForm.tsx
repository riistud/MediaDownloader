import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { X, Clipboard } from "lucide-react";
import { VideoSource } from "@/pages/Home";
import { useToast } from "@/hooks/use-toast";

interface VideoFormProps {
  videoSource: VideoSource;
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function VideoForm({ videoSource, onSubmit, isLoading }: VideoFormProps) {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onSubmit(url.trim());
  };

  const clearInput = () => {
    setUrl("");
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setUrl(clipboardText);
      toast({
        title: "URL Pasted",
        description: "URL has been pasted from clipboard",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Paste Failed",
        description: "Could not access clipboard. Please paste manually."
      });
    }
  };

  const placeholder = videoSource === "tiktok"
    ? "Paste TikTok video URL here..."
    : "Paste Instagram video URL here...";

  const example = videoSource === "tiktok"
    ? "Example: https://www.tiktok.com/@username/video/1234567890"
    : "Example: https://www.instagram.com/p/abcd1234/";

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        <div className="flex">
          <Button
            type="button"
            onClick={handlePaste}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 rounded-l-lg border-r border-gray-300"
            disabled={isLoading}
          >
            <Clipboard className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Paste</span>
          </Button>
          <div className="relative flex-grow">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={placeholder}
              className="px-4 py-6 rounded-none focus:ring-primary border-r-0"
              disabled={isLoading}
              required
            />
            {url && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearInput}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-r-lg font-medium transition duration-200 min-w-[130px] h-[45px]"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="mr-2" /> : null}
            <span>{isLoading ? "Processing..." : "Download"}</span>
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">{example}</p>
      </div>
    </form>
  );
}
