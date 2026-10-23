'use client';

import { useState } from 'react';
import { stashUrl } from '@/actions/articles';

export function StashForm() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<{
    total: number;
    current: number;
    success: number;
    fails: string[];
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // The input may be any pasted text, such as a chat log, so pick the URLs out of it
    const urlPattern = /https?:\/\/[^\s,"'<>|`]+|www\.[^\s,"'<>|`]+/g;
    const matches = input.match(urlPattern);

    if (!matches || matches.length === 0) return;

    const urls = Array.from(new Set(matches.map(u => {
      return u.startsWith('www.') ? `https://${u}` : u;
    })));

    setIsProcessing(true);
    setStatus({ total: urls.length, current: 0, success: 0, fails: [] });

    // One at a time, not in parallel, so that the server is not overloaded and requests do not time out
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const result = await stashUrl(url);
      
      setStatus(prev => {
        if (!prev) return null;
        return {
          ...prev,
          current: i + 1,
          success: result.success ? prev.success + 1 : prev.success,
          fails: result.success ? prev.fails : [...prev.fails, url]
        };
      });
    }

    setIsProcessing(false);
    setInput('');
  };

  return (
    <section className="w-full max-w-[720px] mb-12">
      <div className="flex flex-col gap-4 text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-text-muted">
          Stash new links
        </h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
          <div className="relative flex bg-white dark:bg-surface-dark rounded-lg p-1.5 shadow-xl border border-gray-200 dark:border-surface-border">
            <div className="pl-3 pr-2 pt-3 text-slate-400 dark:text-text-muted self-start">
              <span className="material-symbols-outlined text-xl">link</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="URLs Input"
              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-base py-2.5 min-h-[50px] resize-y"
              placeholder="Paste text containing URLs (e.g. from a chat log or list)..."
              disabled={isProcessing}
              rows={Math.min(10, Math.max(2, input.split('\n').length))}
            />
            <div className="self-end pb-1 pr-1 pl-2">
              <button
                type="submit"
                disabled={isProcessing || !input.trim()}
                className="bg-primary hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-[#111c22] font-bold py-2 px-6 rounded-md transition-all transform active:scale-95 shadow-lg shadow-blue-500/20 whitespace-nowrap h-[42px] flex items-center justify-center min-w-[100px]"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                     <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                     <span className="text-sm">{status ? `${status.current}/${status.total}` : ''}</span>
                  </span>
                ) : (
                  'Stash'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
      
      {status && !isProcessing && (
        <div className={`mt-4 p-4 rounded-lg border text-sm ${
           status.fails.length === 0 
           ? 'bg-green-500/10 border-green-500/20 text-green-400' 
           : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
        }`}>
          <div className="flex items-center gap-2 font-bold mb-1">
             <span className="material-symbols-outlined text-lg">
               {status.fails.length === 0 ? 'check_circle' : 'warning'}
             </span>
             <span>
               {status.success} / {status.total} stashed successfully
             </span>
          </div>
          {status.fails.length > 0 && (
            <div className="mt-2 text-xs opacity-90">
              <p className="mb-1 font-semibold">Failed URLs:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {status.fails.map((url, idx) => (
                  <li key={idx} className="truncate max-w-full">{url}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex gap-4 justify-center text-xs text-slate-500 dark:text-slate-500 font-medium">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">bolt</span>
          Instant Save
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">offline_bolt</span>
          Offline Access
        </span>
      </div>
    </section>
  );
}
