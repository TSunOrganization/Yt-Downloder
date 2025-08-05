import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Music, Video, Download, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext";
import { YoutubeService } from "@/services/YoutubeService.js";
import { VideoPlayer } from "./VideoPlayer";

const youtubeService = new YoutubeService();

export const DownloadOptions = ({ videoUrl, onAudioDownload }) => {
  const { isLoading, setIsLoading } = useApp();
  const [activeTab, setActiveTab] = useState("audio");
  const [downloadProgress, setDownloadProgress] = useState({ 360: 0, 480: 0, 720: 0, 1080: 0 });
  const [downloadedVideo, setDownloadedVideo] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState(null);

  const handleDownload = async (type, quality) => {
    if (!videoUrl) {
      toast.error("Please Select a Video First");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading(type === "audio" ? "Fetching Audio..." : `Fetching ${quality}p Video...`);

    try {
      const response = type === "audio" ? await youtubeService.ytmp3(videoUrl) : await youtubeService.ytmp4(videoUrl, quality);

      if (!response.success) {
        throw new Error(response.error || "Download Failed");
      }

      if (type === "audio") {
        onAudioDownload(response.result);
        toast.update(toastId, { render: "Audio is Ready!", type: "success", isLoading: false, autoClose: 5000 });
      } else {
        setDownloadedVideo({
          url: response.result.download_url,
          title: response.result.title,
          thumbnail: response.result.thumbnail,
        });
        setSelectedQuality(quality);

        for (let i = 0; i <= 100; i += 10) {
          setTimeout(() => {
            setDownloadProgress((prev) => ({ ...prev, [quality]: i }));
          }, i * 30);
        }

        toast.update(toastId, { render: "Video is Ready!", type: "success", isLoading: false, autoClose: 5000 });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : typeof error === 'string' ? error : "Download Failed";
      toast.update(toastId, { render: errorMessage, type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setDownloadProgress((prev) => ({ ...prev, [quality]: 0 }));
      }, 2000);
    }
  };

  const handleVideoDownloadClick = () => {
    if (!downloadedVideo || !selectedQuality) return;

    const link = document.createElement("a");
    link.href = downloadedVideo.url;
    link.download = `${downloadedVideo.title.replace(/[^\w\s]/gi, "")}_${selectedQuality}p.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download Started!");
  };

  const qualities = [
    { quality: 360, label: "SD (360p)" },
    { quality: 480, label: "SD (480p)" },
    { quality: 720, label: "HD (720p)" },
    { quality: 1080, label: "Full HD (1080P)" },
  ];

  return (
    <div className="p-4 shadow-lg animate-fade-in bg-background/90 backdrop-blur-sm">
      <div className="flex justify-center space-x-2 mb-4">
        <Button
          variant={activeTab === "audio" ? "default" : "outline"}
          onClick={() => {
            setActiveTab("audio");
            setDownloadedVideo(null);
          }}
          className={`flex-1 transition-all ${activeTab === 'audio' && 'bg-primary text-primary-foreground'}`}
          disabled={isLoading}
        >
          <Music className="h-4 w-4 mr-2" />
          Audio
        </Button>
        <Button
          variant={activeTab === "video" ? "default" : "outline"}
          onClick={() => {
            setActiveTab("video");
            setDownloadedVideo(null);
          }}
          className={`flex-1 transition-all ${activeTab === 'video' && 'bg-primary text-primary-foreground'}`}
          disabled={isLoading}
        >
          <Video className="h-4 w-4 mr-2" />
          Video
        </Button>
      </div>
      <div className="mt-4 space-y-4">
        {activeTab === "audio" ? (
          <Button
            onClick={() => handleDownload("audio")}
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary ${isLoading && "animate-pulse"}`}
          >
            {isLoading ? (
              <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Music className="h-4 w-4 mr-2" />
            )}
            {isLoading ? "Processing..." : "Fetch Audio"}
          </Button>
        ) : (
          <>
            {downloadedVideo ? (
              <div className="space-y-4">
                <VideoPlayer
                  videoUrl={downloadedVideo.url}
                  title={downloadedVideo.title}
                  thumbnail={downloadedVideo.thumbnail}
                />
                <div className="flex space-x-2">
                  <Button onClick={() => setDownloadedVideo(null)} variant="outline" className="flex-1">
                    Back to Quality Options
                  </Button>
                  <Button
                    onClick={handleVideoDownloadClick}
                    className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download {selectedQuality}p
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {qualities.map(({ quality, label }) => (
                  <Button
                    key={quality}
                    onClick={() => handleDownload("video", quality)}
                    disabled={isLoading}
                    variant="outline"
                    className="flex flex-col items-center p-3 h-auto relative overflow-hidden"
                  >
                    {downloadProgress[quality] > 0 && (
                      <div
                        className="absolute bottom-0 left-0 bg-primary/20 h-1 transition-all duration-300"
                        style={{ width: `${downloadProgress[quality]}%` }}
                      />
                    )}
                    <Download className="h-5 w-5 mb-1" />
                    <span className="text-sm font-medium">{label}</span>
                    {downloadProgress[quality] > 0 && (
                      <span className="text-xs mt-1 text-primary">{downloadProgress[quality]}%</span>
                    )}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-4 text-center">
        {activeTab === 'audio' ? 'Download/Stream Audio Directly in your Browser' : downloadedVideo ? 'Watch online or download the video' : 'Download/Stream Video in your Preferred Quality'}
      </p>
    </div>
  );
};