'use server';

import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/db';
import { articles, type Article } from '@/lib/db/schema';
import { scrapeOgp } from '@/lib/scraper';
import { auth } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

function generateId(): string {
  return crypto.randomUUID();
}

export async function stashUrl(url: string): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  
  if (!session?.user?.isAdmin) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Validate URL
    new URL(url);

    // Scrape OGP data
    const ogpData = await scrapeOgp(url);

    // Insert into database
    const db = getDb();
    await db.insert(articles).values({
      id: generateId(),
      url,
      title: ogpData.title,
      description: ogpData.description,
      imageUrl: ogpData.imageUrl,
      status: 'unread',
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to stash URL:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to stash URL' 
    };
  }
}

export async function getArticles(status?: 'unread' | 'read' | 'archived'): Promise<Article[]> {
  try {
    const db = getDb();
    if (status) {
      return db.select().from(articles).where(eq(articles.status, status)).orderBy(desc(articles.createdAt));
    }
    return db.select().from(articles).orderBy(desc(articles.createdAt));
  } catch (error) {
    console.error('Failed to get articles:', error);
    return [];
  }
}

export async function updateArticle(
  id: string,
  data: { title?: string; status?: 'unread' | 'read' | 'archived' }
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  
  if (!session?.user?.isAdmin) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const db = getDb();
    await db
      .update(articles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(articles.id, id));

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to update article:', error);
    return { success: false, error: 'Failed to update article' };
  }
}

export async function deleteArticle(id: string): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  
  if (!session?.user?.isAdmin) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const db = getDb();
    await db.delete(articles).where(eq(articles.id, id));
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete article:', error);
    return { success: false, error: 'Failed to delete article' };
  }
}
