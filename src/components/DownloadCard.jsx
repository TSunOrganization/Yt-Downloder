import React from 'react';
import { toast } from 'sonner';
import { YoutubeService } from '@/services/YoutubeService.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Music, Video, Download, LoaderCircle } from 'lucide-react';

const youtubeService = new YoutubeService();

export const DownloadCard = ({ video, isLoading, setIsLoading }) => {
  const handleDownload = async (type, quality = 360) => {
    setIsLoading(true);
    const toastId = toast.loading(`Preparing ${type === 'audio' ? 'MP3' : `${quality}p MP4`} download...`);

    try {
      const response =
        type === 'audio'
          ? await youtubeService.ytmp3(video.url)
          : await youtubeService.ytmp4(video.url, quality);

      if (response.success && response.result.download_url) {
        toast.success(`${type === 'audio' ? 'Audio' : 'Video'} is ready! Starting download...`, { id: toastId });
        
        // Trigger download
        const link = document.createElement('a');
        link.href = response.result.download_url;
        link.download = `${video.title}.${type === 'audio' ? 'mp3' : 'mp4'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      } else {
        throw new Error(response.error || 'Failed to prepare download link.');
      }
    } catch (error) {
      toast.error(error.message, { id: toastId });
      console.error('Download error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 max-w-4xl mx-auto animate-fade-in">
      <Card className="overflow-hidden shadow-lg border">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:w-1/2">
            <CardHeader>
              <CardTitle className="line-clamp-2">{video.title}</CardTitle>
              <CardDescription className="line-clamp-3 pt-2">{video.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center"><Music className="w-4 h-4 mr-2" /> Audio Download</h4>
                <Button onClick={() => handleDownload('audio')} disabled={isLoading} className="w-full">
                  {isLoading ? <LoaderCircle className="animate-spin mr-2"/> : <Download className="mr-2 h-4 w-4" />}
                  Download MP3
                </Button>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center"><Video className="w-4 h-4 mr-2" /> Video Download</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[360, 720, 1080].map(q => (
                    <Button key={q} onClick={() => handleDownload('video', q)} disabled={isLoading} variant="outline">
                       {isLoading ? <LoaderCircle className="animate-spin mr-2"/> : <Download className="mr-2 h-4 w-4" />}
                       Download {q}p
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
};