'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-surface-border bg-white/80 dark:bg-background-dark/80 backdrop-blur-md transition-colors duration-300">
      <div className="flex justify-center px-4 sm:px-8">
        <div className="flex w-full max-w-[1200px] items-center justify-between py-4">
          <div className="flex items-center gap-2 select-none cursor-pointer">
            <span className="material-symbols-outlined text-primary text-3xl">bolt</span>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Stash</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {status === 'loading' ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-surface-border animate-pulse" />
            ) : session?.user ? (
              <div className="flex items-center gap-3">
                {session.user.isAdmin && (
                  <button
                    onClick={() => signOut()}
                    className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-surface-border text-slate-500 dark:text-text-muted transition-colors"
                    title="Sign out"
                  >
                    <span className="material-symbols-outlined text-xl">logout</span>
                  </button>
                )}
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-blue-600 ring-2 ring-white dark:ring-surface-border cursor-pointer overflow-hidden">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                      {session.user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => signIn('github')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium text-sm hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined text-lg">login</span>
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
