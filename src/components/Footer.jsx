import React from 'react';
import { Github, Link, Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full text-center p-6 text-zinc-500 text-sm z-10">
      <div className="mb-4 flex justify-center items-center gap-6">
        <a href="https://github.com/SaeedX302" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
          <Github className="w-5 h-5" /> GitHub
        </a>
        <a href="https://linktr.ee/saeedxdie" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
          <Link className="w-5 h-5" /> Linktree
        </a>
        <a href="https://gravatar.com/cheerfuld27b01881a" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
          <Globe className="w-5 h-5" /> Gravatar
        </a>
      </div>
      <p className="mb-2">Made With 🫀 By ༯𝙎ค૯𝙀𝘿✘🫀</p>
      <p>All Credits To °【༯𝙎ค૯𝙀𝘿】✘,【.ISHU.】</p>
    </footer>
  );
};