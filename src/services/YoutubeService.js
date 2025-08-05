import axios from "axios";

const API_KEYS = [
  "AIzaSyAU9XyO9XjBbEUwg50iA0dNzVULHWWdC40",
  "AIzaSyD-mP0ZnF8g4EokQVtAWRrkWDZK6XW2ibE",
  "AIzaSyDe0gxJE0jeYSMbSZirRG-s8bP1QmSYGFk",
  "AIzaSyCAzkMAgffAzX2ygLRNqSAzaUaF69QJv0o",
  "AIzaSyC3K5nFGD1j82UCGu6Sv8sV5ycvL2auicM",
  "AIzaSyD8QkoOv0i4f79aoK8E403p3R0N_IWEE0o",
  "AIzaSyC6fnIGYD3HnQvJm_iIPN_2XSuGdwfr3yQ",
];
const SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
let currentApiKeyIndex = 0;

const TSun_Creator = "TSun";

class DownloadService {
  async checkTaskStatus(taskId) {
    let resultUrl = null;
    try {
      do {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const response = await axios.get(`https://api.grabtheclip.com/get-download/${taskId}`);
        resultUrl = response?.data?.result?.url;
      } while (!resultUrl);
      return resultUrl;
    } catch (error) {
      throw new Error("Failed to fetch download URL");
    }
  }

  async ytmp3(url, videoInfo) {
    try {
      if (!url) throw new Error("URL required 📛");
      const response = await axios.post(
        "https://api.grabtheclip.com/submit-download",
        { url, height: 0, media_type: "audio" },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          },
        }
      );

      const taskId = response?.data?.task_id;
      if (!taskId) throw new Error("Invalid YouTube URL ❗");

      const downloadUrl = await this.checkTaskStatus(taskId);

      const result = {
        title: videoInfo.title,
        thumbnail: videoInfo.thumbnail || videoInfo.image,
        duration: videoInfo.timestamp || videoInfo.duration?.timestamp,
        download_url: downloadUrl,
      };

      return { status: 200, success: true, creator: TSun_Creator, result };
    } catch (error) {
      console.log(error);
      return { status: 500, success: false, creator: TSun_Creator, error: error.message };
    }
  }

  async ytmp4(url, videoInfo, quality) {
    try {
      if (!url) throw new Error("URL required 📛");
      const selectedQuality = quality || 360;
      if (![360, 720, 1080].includes(selectedQuality)) {
        throw new Error("Invalid Format ❗ - Only 360, 720, or 1080 supported");
      }
      const response = await axios.post(
        "https://api.grabtheclip.com/submit-download",
        { url, height: selectedQuality, media_type: "video" },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          },
        }
      );
      const taskId = response?.data?.task_id;
      if (!taskId) throw new Error("Invalid YouTube URL or API error ❗");
      const downloadUrl = await this.checkTaskStatus(taskId);
      const result = {
        quality: `${selectedQuality}p`,
        title: videoInfo.title,
        thumbnail: videoInfo.thumbnail || videoInfo.image,
        duration: videoInfo.timestamp || videoInfo.duration?.timestamp,
        download_url: downloadUrl,
      };
      return { status: 200, success: true, creator: TSun_Creator, result };
    } catch (error) {
      console.log(error);
      return { status: 500, success: false, creator: TSun_Creator, error: error.message };
    }
  }
}

export class YoutubeService {
  constructor() {
    this.searchService = new YouTubeSearchService();
    this.downloadService = new DownloadService();
  }

  async search(query) {
    return this.searchService.search(query);
  }

  async ytmp3(url) {
    try {
      if (!url) throw new Error("URL required 📛");
      const videoInfo = await this.search(url);
      if (!videoInfo.success || !videoInfo.results.length) {
        throw new Error("Could not find video information");
      }
      return this.downloadService.ytmp3(url, videoInfo.results[0]);
    } catch (error) {
      console.log(error);
      return { status: 500, success: false, creator: "TSun", error: error.message };
    }
  }

  async ytmp4(url, quality) {
    try {
      if (!url) throw new Error("URL required 📛");
      const videoInfo = await this.search(url);
      if (!videoInfo.success || !videoInfo.results.length) {
        throw new Error("Could not find video information");
      }
      return this.downloadService.ytmp4(url, videoInfo.results[0], quality);
    } catch (error) {
      console.log(error);
      return { status: 500, success: false, creator: "TSun", error: error.message };
    }
  }

  isYouTubeUrl(url) {
    return this.searchService.isYouTubeUrl(url);
  }

  extractVideoId(url) {
    return this.searchService.extractVideoId(url);
  }

  getYouTubeUrl(videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
}

class YouTubeSearchService {
  async search(query) {
    let attempts = 0;
    let lastError;

    while (attempts < API_KEYS.length) {
      try {
        const response = await axios.get(SEARCH_URL, {
          params: {
            part: "snippet",
            maxResults: 10,
            q: query,
            type: "video",
            key: API_KEYS[currentApiKeyIndex],
            fields: "items(id(videoId),snippet(title,description,channelTitle,publishedAt,thumbnails))",
          },
          timeout: 5000,
        });
        currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
        return {
          success: true,
          results: response.data.items.map((item) => {
            const thumbs = item.snippet.thumbnails;
            return {
              timestamp: new Date(item.snippet.publishedAt).toISOString(),
              id: item.id.videoId,
              title: item.snippet.title,
              description: item.snippet.description,
              artist: item.snippet.channelTitle,
              published: item.snippet.publishedAt,
              thumbnail: thumbs.maxres?.url || thumbs.high?.url || thumbs.medium?.url || thumbs.default?.url || "",
              url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            };
          }),
        };
      } catch (error) {
        lastError = error;
        attempts++;
        currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
        if (error?.response?.data?.error?.errors?.[0]?.reason === "quotaExceeded") {
          continue;
        }
        break;
      }
    }
    console.error("YouTube API error:", lastError);
    return {
      success: false,
      error: lastError?.response?.data?.error?.message || "Failed to search YouTube. Please try again later.",
    };
  }
  isYouTubeUrl(url) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(url);
  }
  extractVideoId(url) {
    const regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regex);
    return match && match[2].length === 11 ? match[2] : null;
  }
}