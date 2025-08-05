import React, { useState } from 'react';
import { Clipboard, Search } from 'lucide-react';

export const DownloaderForm = ({ onFetch, isLoading }) => {
  const [url, setUrl] = useState('');
  const [server, setServer] = useState('in');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onFetch(url, server);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text);
    } catch (err) {
      console.error('Failed to read clipboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white/5 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10">
      <div className="relative mb-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube URL"
          className="w-full p-4 pl-5 pr-12 text-white bg-black/20 rounded-full border-2 border-transparent focus:border-red-500 focus:outline-none transition-colors"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={handlePaste}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
          disabled={isLoading}
        >
          <Clipboard className="w-6 h-6" />
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={server}
          onChange={(e) => setServer(e.target.value)}
          className="w-full sm:w-1/2 p-4 text-white bg-black/20 rounded-full border-2 border-transparent focus:border-red-500 focus:outline-none transition-colors appearance-none text-center"
          disabled={isLoading}
        >
            <option value="in">Mumbai, INDIA</option>
            <option value="fr">Paris, France</option>
            <option value="was">Washington, D.C., US</option>
        </select>
        <button
          type="submit"
          className="w-full sm:w-1/2 p-4 flex items-center justify-center gap-2 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors disabled:bg-red-800 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
};