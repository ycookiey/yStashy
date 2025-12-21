import { auth } from "@/lib/auth";
import { getArticles } from "@/actions/articles";
import { Header } from "@/components/Header";
import { StashForm } from "@/components/StashForm";
import { ArticleGrid } from "@/components/ArticleGrid";

export default async function Home() {
  const session = await auth();
  const articles = await getArticles();
  const isAdmin = session?.user?.isAdmin ?? false;

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col items-center w-full px-4 sm:px-8 py-8">
        {/* Input Section (Admin only) */}
        {isAdmin && <StashForm />}

        {/* Articles Grid */}
        <ArticleGrid articles={articles} isAdmin={isAdmin} />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-surface-border bg-background-dark py-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} Stash. Zero-latency bookmarking.
          </p>
        </div>
      </footer>
    </>
  );
}
