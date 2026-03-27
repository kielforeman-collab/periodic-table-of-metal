import { useState, useEffect } from 'react';

interface Album {
  title: string;
  coverUrl?: string;
}

// Module-level cache: prevents re-fetching covers for bands already viewed
const coverCache = new Map<string, Album[]>();

export function useAlbumCovers(bandName: string, initialAlbums: Album[] = []) {
  const cacheKey = `${bandName}::${initialAlbums.map(a => a.title).join(',')}`;
  const [albums, setAlbums] = useState<Album[]>(() => coverCache.get(cacheKey) || initialAlbums);
  const [loading, setLoading] = useState(!coverCache.has(cacheKey));

  useEffect(() => {
    if (!bandName || initialAlbums.length === 0) return;

    // Return cached immediately
    if (coverCache.has(cacheKey)) {
      setAlbums(coverCache.get(cacheKey)!);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const fetchCovers = async () => {
      const updatedAlbums = await Promise.all(
        initialAlbums.map(async (album) => {
          if (album.coverUrl) return album;

          try {
            const query = encodeURIComponent(`${bandName} ${album.title}`);
            const response = await fetch(`https://itunes.apple.com/search?term=${query}&entity=album&limit=1`);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
              const highResCover = data.results[0].artworkUrl100.replace('100x100bb', '300x300bb');
              return { ...album, coverUrl: highResCover };
            }
          } catch (error) {
            console.error(`Error fetching cover for ${album.title}:`, error);
          }
          return album;
        })
      );

      if (isMounted) {
        coverCache.set(cacheKey, updatedAlbums);
        setAlbums(updatedAlbums);
        setLoading(false);
      }
    };

    fetchCovers();

    return () => {
      isMounted = false;
    };
  }, [bandName, cacheKey]);

  return { albums, loading };
}
