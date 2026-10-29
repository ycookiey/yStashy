import * as cheerio from 'cheerio';

export interface OgpData {
  title: string;
  description: string;
  imageUrl: string | null;
}

export async function scrapeOgp(url: string): Promise<OgpData> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; StashBot/1.0; +https://stash.ycookiey.com)',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const title =
    $('meta[property="og:title"]').attr('content') ||
    $('title').text() ||
    url;

  const description =
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    '';

  let imageUrl = $('meta[property="og:image"]').attr('content') || null;

  if (imageUrl && !imageUrl.startsWith('http')) {
    try {
      const baseUrl = new URL(url);
      imageUrl = new URL(imageUrl, baseUrl.origin).href;
    } catch {
      imageUrl = null;
    }
  }

  return {
    title: title.trim(),
    description: description.trim(),
    imageUrl,
  };
}

export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
