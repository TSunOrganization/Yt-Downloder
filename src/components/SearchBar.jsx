import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { YoutubeService } from "@/services/YoutubeService.js";

const youtubeService = new YoutubeService();

export const SearchBar = ({ onSearch, onVideoSelect, isLoading, setIsLoading }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!query.trim()) {
      toast.error("Please enter a search query or YouTube URL.");
      return;
    }

    setIsLoading(true);

    try {
      const isUrl = youtubeService.isYouTubeUrl(query);
      if (isUrl) {
        const videoId = youtubeService.extractVideoId(query);
        const response = await youtubeService.search(videoId);
         if (response.success && response.results?.length) {
          onVideoSelect(response.results[0]);
        } else {
           setError("Could not find the video for the provided URL.");
           toast.error("Could not find the video for the provided URL.");
        }
      } else {
        const response = await youtubeService.search(query);
        if (response.success && response.results?.length) {
          onSearch(response.results);
          toast.success(`Found ${response.results.length} video(s).`);
        } else {
          setError(response.error || "No videos found. Try a different search term.");
          toast.error(response.error || "No videos found.");
        }
      }
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`transition-all duration-300 mx-auto max-w-3xl mt-24 px-4 animate-slide-in ${
        isFocused ? "scale-105" : ""
      }`}
    >
      <div className="relative flex items-center">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setError(null);
          }}
          placeholder="Search for a video or paste a YouTube URL..."
          className="py-6 pl-12 pr-20 rounded-full shadow-lg border-2 focus-within:border-primary transition-all"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isLoading}
        />
        <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
        <Button
          type="submit"
          disabled={isLoading}
          className={`absolute right-2 rounded-full hover:bg-primary/90 transition-all ${
            isLoading ? "animate-pulse" : ""
          }`}
          variant={error ? "destructive" : "default"}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <LoaderCircle className="animate-spin h-4 w-4" />
              Searching...
            </span>
          ) : (
            "Search"
          )}
        </Button>
      </div>
      <div className="mt-2 text-center">
        <p className="text-sm text-muted-foreground">
          Enter a YouTube URL or search for videos.
        </p>
        {error && (
          <p className="text-sm text-red-500 mt-1 animate-fade-in">{error}</p>
        )}
      </div>
    </form>
  );
};