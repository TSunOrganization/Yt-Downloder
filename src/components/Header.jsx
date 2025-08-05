import React, { useState } from 'react';
import { Sun, Moon, History } from 'lucide-react';
import { ChangelogModal } from './ChangelogModal';

export const Header = () => {
  const [theme, setTheme] = useState('dark');
  const [isChangelogOpen, setChangelogOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  
  // Set initial theme
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, [])

  return (
    <>
      <header className="absolute top-4 right-4 flex items-center gap-4">
        <button onClick={() => setChangelogOpen(true)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          <History className="w-5 h-5 text-white" />
        </button>
        <button onClick={toggleTheme} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          {theme === 'light' ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
        </button>
      </header>
      <ChangelogModal isOpen={isChangelogOpen} onClose={() => setChangelogOpen(false)} />
    </>
  );
};