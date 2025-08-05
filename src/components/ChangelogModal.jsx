import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const ChangelogModal = ({ isOpen, onClose }) => {
  const changelogData = [
    {
      version: '2.0.0',
      date: '2025-08-05',
      author: 'TSun Ai',
      changes: [
        'Rebuilt the application using React and Tailwind CSS for a modern, dynamic experience.',
        'Implemented a sleek, dark-mode UI inspired by the previous "TSun" projects.',
        'Added a theme switcher to toggle between light and dark modes.',
        'Integrated a changelog modal to track version history.',
        'Added the signature "Legendry Footer" with social links.',
        'Enhanced UI with smooth animations and transitions using Framer Motion.'
      ],
    },
    {
      version: '1.0.0',
      date: 'Unknown',
      author: 'Original Creator',
      changes: ['Initial release with vanilla HTML, CSS, and JavaScript.'],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-800 text-white p-6 rounded-2xl shadow-xl w-full max-w-lg relative border border-white/10 max-h-[80vh] overflow-y-auto"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4">Changelog</h2>
            <div className="space-y-6">
              {changelogData.map((entry) => (
                <div key={entry.version}>
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-xl font-semibold text-red-500">Version {entry.version}</h3>
                    <p className="text-xs text-zinc-400">{entry.date}</p>
                  </div>
                  <p className="text-xs text-zinc-500 mb-2">by {entry.author}</p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300">
                    {entry.changes.map((change, index) => (
                      <li key={index}>{change}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};