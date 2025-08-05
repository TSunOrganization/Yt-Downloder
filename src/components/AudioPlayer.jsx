import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Download } from "lucide-react";
import { toast } from "sonner";

export const AudioPlayer = ({ audioUrl, title }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const decodedTitle = (() => {
    const txt = document.createElement("textarea");
    txt.innerHTML = title;
    return txt.value
      .replace(/[^\w\s'-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  })();

  const fileName = decodedTitle.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const handleAudioEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", handleAudioEnd);

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", handleAudioEnd);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((e) => {
          toast.error("Failed to Play Audio. Please Try Again.");
          console.error("Audio Playback Error:", e);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const forward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        duration
      );
    }
  };

  const rewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 10,
        0
      );
    }
  };

  const handleSliderChange = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
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
    link.href = audioUrl;
    link.download = `${fileName || "audio"}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Starting Download...");
  };

  return (
    <Card className={`overflow-hidden shadow-lg animate-fade-in ${isLoading ? 'animate-pulse' : ''}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="font-medium text-center line-clamp-2">{decodedTitle}</h3>
          <div className="flex items-center justify-between space-x-2 mt-4">
            <span className="text-xs">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSliderChange}
              className="mx-2 flex-1"
            />
            <span className="text-xs">{formatTime(duration)}</span>
          </div>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <Button variant="outline" size="icon" onClick={rewind} className="rounded-full hover:bg-primary/10">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              onClick={togglePlayPause}
              variant="default"
              size="icon"
              className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
            </Button>
            <Button variant="outline" size="icon" onClick={forward} className="rounded-full hover:bg-primary/10">
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={handleDownload} className="rounded-full flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Download Audio</span>
            </Button>
          </div>
        </div>
      </CardContent>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </Card>
  );
};