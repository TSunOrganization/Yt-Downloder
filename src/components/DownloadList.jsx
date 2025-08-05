import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

export const DownloadList = ({ data }) => {
  const video = data[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl bg-white/5 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10"
    >
      <img src={`https://img.youtube.com/vi/${video.videoid}/maxresdefault.jpg`} alt={video.title} className="w-full rounded-lg mb-4" />
      <h2 className="text-xl font-bold mb-1">{video.title}</h2>
      <p className="text-sm text-zinc-400 mb-6">Duration: {video.length} min</p>

      <div className="space-y-3">
        {data.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex justify-between items-center p-4 bg-black/20 rounded-lg"
          >
            <div>
              <p className="font-semibold">{option.resolution} ({option.filetype})</p>
              <p className="text-xs text-zinc-400">
                Audio: {option.has_audio ? '✅' : '❌'} | Size: {option.filesize_mb} MB
              </p>
            </div>
            <a
              href={option.url}
              download
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};