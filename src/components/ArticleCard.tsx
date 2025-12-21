'use client';

import { useState } from 'react';
import type { Article } from '@/lib/db/schema';
import { deleteArticle, updateArticle } from '@/actions/articles';
import { extractDomain } from '@/lib/scraper';

interface ArticleCardProps {
  article: Article;
  isAdmin: boolean;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 604800)}w ago`;
}

export function ArticleCard({ article, isAdmin }: ArticleCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    setIsDeleting(true);
    await deleteArticle(article.id);
  };

  const handleStatusChange = async (status: 'unread' | 'read' | 'archived') => {
    await updateArticle(article.id, { status });
    setShowMenu(false);
  };

  const domain = extractDomain(article.url);

  return (
    <article className="group relative flex flex-col bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-surface-border overflow-hidden hover:shadow-2xl hover:border-primary/50 transition-all duration-300">
      {/* Image */}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative aspect-video bg-gray-100 dark:bg-black w-full overflow-hidden"
      >
        {article.imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url("${article.imageUrl}")` }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-border to-background-dark">
            <span className="material-symbols-outlined text-white/10 text-6xl group-hover:text-primary/20 transition-colors">
              image_not_supported
            </span>
          </div>
        )}
      </a>

      {/* Admin Actions */}
      {isAdmin && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-1.5 rounded-full transition-colors"
            disabled={isDeleting}
          >
            <span className="material-symbols-outlined text-sm">more_vert</span>
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-surface-dark rounded-lg shadow-xl border border-gray-200 dark:border-surface-border py-1 min-w-[150px] z-10">
              <button
                onClick={() => handleStatusChange('read')}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-surface-border flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">check_circle</span>
                Mark as Read
              </button>
              <button
                onClick={() => handleStatusChange('archived')}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-surface-border flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">archive</span>
                Archive
              </button>
              <hr className="my-1 border-gray-200 dark:border-surface-border" />
              <button
                onClick={handleDelete}
                className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">delete</span>
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block group-hover:text-primary transition-colors"
        >
          <h4 className="text-base font-bold leading-snug text-slate-900 dark:text-white line-clamp-2 mb-2">
            {article.title || 'Untitled'}
          </h4>
        </a>
        <div className="mt-auto flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-surface-border flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-400">
            {domain.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-text-muted truncate">
            {domain}
          </span>
          <span className="mx-1 text-slate-300 dark:text-gray-700">•</span>
          <span className="text-xs text-slate-400 dark:text-slate-600">
            {formatTimeAgo(new Date(article.createdAt))}
          </span>
          {article.status !== 'unread' && (
            <>
              <span className="mx-1 text-slate-300 dark:text-gray-700">•</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                article.status === 'read' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}>
                {article.status}
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
