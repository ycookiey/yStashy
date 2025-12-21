import type { Article } from '@/lib/db/schema';
import { ArticleCard } from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
  isAdmin: boolean;
}

export function ArticleGrid({ articles, isAdmin }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="w-full max-w-[1200px] text-center py-20">
        <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">
          library_books
        </span>
        <p className="text-slate-500 dark:text-text-muted text-lg">
          No articles stashed yet
        </p>
        <p className="text-slate-400 dark:text-slate-600 text-sm mt-2">
          Paste a URL above to get started
        </p>
      </div>
    );
  }

  return (
    <section className="w-full max-w-[1200px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">library_books</span>
          Your Stash
        </h3>
        <div className="text-sm text-slate-500 dark:text-text-muted">
          {articles.length} article{articles.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} isAdmin={isAdmin} />
        ))}
      </div>
    </section>
  );
}
