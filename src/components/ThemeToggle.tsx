'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center text-slate-500 dark:text-slate-400"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <span className="material-symbols-outlined text-[20px]">light_mode</span>
      ) : (
        <span className="material-symbols-outlined text-[20px]">dark_mode</span>
      )}
    </button>
  );
}
