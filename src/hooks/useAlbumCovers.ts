import { useState, useEffect } from 'react';

interface Album {
  title: string;
  coverUrl?: string;
}

// Module-level cache: prevents re-fetching covers for bands already viewed
const coverCache = new Map<string, Album[]>();

// Cache artist IDs once found so subsequent albums for the same artist are faster
const artistIdCache = new Map<string, number>();

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
      // Step 1: Try to find the artist's iTunes ID so we can use the reliable lookup API
      let artistId = artistIdCache.get(bandName.toLowerCase());

      if (!artistId) {
        try {
          const artistQuery = encodeURIComponent(bandName);
          const artistRes = await fetch(`https://itunes.apple.com/search?term=${artistQuery}&entity=musicArtist&limit=5`);
          const artistData = await artistRes.json();
          const artistMatch = artistData.results?.find(
            (r: any) => r.artistName?.toLowerCase() === bandName.toLowerCase()
          );
          if (artistMatch) {
            artistId = artistMatch.artistId;
            artistIdCache.set(bandName.toLowerCase(), artistId!);
          }
        } catch (error) {
          console.error(`Error finding artist ID for ${bandName}:`, error);
        }
      }

      // Step 2: If we have an artist ID, fetch their full discography via lookup API
      let discography: any[] = [];
      if (artistId) {
        try {
          const lookupRes = await fetch(`https://itunes.apple.com/lookup?id=${artistId}&entity=album&limit=50`);
          const lookupData = await lookupRes.json();
          discography = lookupData.results?.filter((r: any) => r.wrapperType === 'collection') || [];
        } catch (error) {
          console.error(`Error fetching discography for ${bandName}:`, error);
        }
      }

      // Step 3: Match each album against the discography, falling back to search
      const updatedAlbums = await Promise.all(
        initialAlbums.map(async (album) => {
          if (album.coverUrl) return album;

          // Try discography lookup first (most accurate)
          const normalizedTitle = album.title.toLowerCase();
          const discoMatch = discography.find(
            (r: any) => r.collectionName?.toLowerCase() === normalizedTitle
              || r.collectionName?.toLowerCase().startsWith(normalizedTitle)
          );

          if (discoMatch?.artworkUrl100) {
            const highResCover = discoMatch.artworkUrl100.replace('100x100bb', '300x300bb');
            return { ...album, coverUrl: highResCover };
          }

          // Fallback: text search with artist filtering
          try {
            const query = encodeURIComponent(`${bandName} ${album.title}`);
            const response = await fetch(`https://itunes.apple.com/search?term=${query}&entity=album&limit=5`);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
              const normalizedBand = bandName.toLowerCase();
              const match = data.results.find(
                (r: any) => r.artistName?.toLowerCase().includes(normalizedBand)
              );

              if (match?.artworkUrl100) {
                const highResCover = match.artworkUrl100.replace('100x100bb', '300x300bb');
                return { ...album, coverUrl: highResCover };
              }
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
