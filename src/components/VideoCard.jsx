import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Link, ChevronUp, ChevronDown } from "lucide-react";

export const VideoCard = ({ video, onSelect, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [sine, setSine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSine((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const videoUrl = video.url || (video.videoId ? `https://www.youtube.com/watch?v=${video.videoId}` : "#");
  const thumbnailUrl = video.thumbnail || video.image || "";
  const scale = 100 + Math.sin(sine * (Math.PI / 50)) * 5;
  const duration = "...";
  const title = decodeHtml(video.title);

  return (
    <div
      className={`video-card group transition-all duration-300 rounded-lg overflow-hidden shadow-lg hover:shadow-xl bg-background border border-gray-200 ${
        isSelected ? "ring-2 ring-primary" : ""
      } transform hover:-translate-y-1 hover:scale-[1.02] transition-transform animate-slide-in`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video overflow-hidden">
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-1000 ${isHovered ? "scale-105" : ""}`}
            style={{ transform: `scale(${scale}%)` }}
          />
        )}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-center justify-center opacity-0 ${
            isHovered || isSelected ? "opacity-100" : ""
          } transition-opacity duration-300`}
        >
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-primary/20 backdrop-blur-sm border-primary/50 hover:bg-primary/40"
            onClick={() => onSelect(video)}
          >
            <Play className="h-6 w-6 text-white" />
          </Button>
        </div>
        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {duration}
        </span>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium text-sm line-clamp-2 flex-1">{title}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              window.open(videoUrl, "_blank");
            }}
            title="Open in YouTube"
          >
            <Link className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 h-8 px-2 text-xs text-muted-foreground"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              Hide details
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              Show details
            </>
          )}
        </Button>
        {showDetails && (
          <div className="mt-2 pt-2 border-t border-gray-200 text-xs space-y-2">
            {video.id && (
              <div className="flex">
                <span className="font-medium w-20">Video ID:</span>
                <span className="break-all flex-1">{video.id}</span>
              </div>
            )}
            {video.description && (
              <div className="flex">
                <span className="font-medium w-20">Description:</span>
                <span className="break-all flex-1 line-clamp-3">{video.description}</span>
              </div>
            )}
            <div className="flex">
              <span className="font-medium w-20">URL:</span>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all flex-1"
                onClick={(e) => e.stopPropagation()}
              >
                {videoUrl}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};