import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Download, Maximize, Minimize } from "lucide-react";
import { toast } from "sonner";

export const VideoPlayer = ({ videoUrl, title, thumbnail }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const decodedTitle = (() => {
    const txt = document.createElement("textarea");
    txt.innerHTML = title;
    return txt.value.replace(/[^\w\s'-]/g, " ").replace(/\s+/g, " ").trim();
  })();
  const fileName = decodedTitle.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setVideoData = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };
    const setVideoTime = () => setCurrentTime(video.currentTime);
    const handleVideoEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      video.currentTime = 0;
    };
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener("loadeddata", setVideoData);
    video.addEventListener("timeupdate", setVideoTime);
    video.addEventListener("ended", handleVideoEnd);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      video.removeEventListener("loadeddata", setVideoData);
      video.removeEventListener("timeupdate", setVideoTime);
      video.removeEventListener("ended", handleVideoEnd);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [videoUrl]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((e) => {
          toast.error("Failed to Play Video. Video Hasn't Loaded Well.");
          console.error("Video Playback Error:", e);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen().catch((err) => {
          toast.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      }
    }
  };

  const forward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
    }
  };

  const rewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
    }
  };

  const handleSliderChange = (value) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `${fileName || "video"}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Starting Download...");
  };

  return (
    <Card className={`overflow-hidden shadow-lg animate-fade-in ${isLoading ? 'animate-pulse' : ''}`}>
      <CardContent className="p-0">
        <div className="relative group">
          <video
            ref={videoRef}
            src={videoUrl}
            preload="metadata"
            poster={thumbnail}
            className="w-full aspect-video bg-black rounded-t-lg"
            onClick={togglePlayPause}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={togglePlayPause}
              variant="ghost"
              size="icon"
              className="h-16 w-16 rounded-full bg-black/50 hover:bg-black/70 text-white"
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
            </Button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-8 rounded-b-lg">
            <div className="flex items-center justify-between space-x-2">
              <span className="text-xs text-white">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSliderChange}
                className="mx-2 flex-1"
              />
              <span className="text-xs text-white">{formatTime(duration)}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={rewind} className="text-white hover:bg-white/10 rounded-full">
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button onClick={togglePlayPause} variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={forward} className="text-white hover:bg-white/10 rounded-full">
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/10 rounded-full">
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </Button>
                <Button variant="ghost" onClick={handleDownload} className="text-white hover:bg-white/10 rounded-full">
                  <Download className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium line-clamp-2">{decodedTitle}</h3>
        </div>
      </CardContent>
    </Card>
  );
};