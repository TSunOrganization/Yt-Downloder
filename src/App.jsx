import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { DownloaderForm } from './components/DownloaderForm';
import { DownloadList } from './components/DownloadList';
import { Footer } from './components/Footer';

function App() {
  const [downloadData, setDownloadData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = (url, server) => {
    setIsLoading(true);
    setError(null);
    setDownloadData(null);

    // UPDATED: Fetch from the internal proxy API route
    fetch(`/api/download?url=${encodeURIComponent(url)}&server=${server}`)
      .then((res) => {
        if (!res.ok) {
          // Try to get a more specific error message from the proxy
          return res.json().then(errData => {
            throw new Error(errData.error?.err || `Server error: ${res.status}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        if (data[0] && data[0].status === 200) {
          setDownloadData(data);
        } else {
          setError(data[0]?.err || 'Could not fetch video. Please check the URL.');
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'An error occurred. The server may be down or the URL is invalid.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // The rest of your App.jsx component remains the same...
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 orb animate-orby" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 orb bg-gradient-to-r from-red-500 to-orange-500 animate-orby animation-delay-[-2s]" />

      <Header />

      <main className="w-full max-w-4xl mx-auto flex flex-col items-center z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hero text-4xl md:text-5xl font-bold my-8"
        >
          YouTube Video Downloader
        </motion.h1>

        <DownloaderForm onFetch={handleFetch} isLoading={isLoading} />

        <div className="w-full mt-8">
          <AnimatePresence>
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center items-center h-40">
                <div className="w-12 h-12 border-4 border-zinc-700 border-t-red-500 rounded-full animate-spin" />
              </motion.div>
            )}
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center p-4 bg-red-500/20 text-red-400 rounded-lg">
                <p className="font-bold">Error Occurred</p>
                <p>{error}</p>
              </motion.div>
            )}
            {downloadData && <DownloadList data={downloadData} />}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;