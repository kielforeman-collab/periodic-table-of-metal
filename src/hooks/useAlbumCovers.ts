import { useState, useEffect } from 'react';

interface Album {
  title: string;
  coverUrl?: string;
}

export function useAlbumCovers(bandName: string, initialAlbums: Album[] = []) {
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bandName || initialAlbums.length === 0) return;

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
              // Get a higher resolution image (100x100 -> 300x300)
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
        setAlbums(updatedAlbums);
        setLoading(false);
      }
    };

    fetchCovers();

    return () => {
      isMounted = false;
    };
  }, [bandName, initialAlbums]);

  return { albums, loading };
}
