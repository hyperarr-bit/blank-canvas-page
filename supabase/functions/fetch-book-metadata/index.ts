const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ success: false, error: 'URL is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Fetching metadata from:', url);

    // Try Google Books API first if it looks like a book URL
    const isbnMatch = url.match(/(?:isbn[=\/:]?\s*)(\d{10,13})/i);
    
    // Fetch the page HTML to extract Open Graph metadata
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CoreApp/1.0)',
        'Accept': 'text/html',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();

    // Extract Open Graph and meta tags
    const getMetaContent = (html: string, property: string): string => {
      // Try og: tags
      const ogMatch = html.match(new RegExp(`<meta[^>]*property=["']og:${property}["'][^>]*content=["']([^"']*)["']`, 'i'))
        || html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:${property}["']`, 'i'));
      if (ogMatch) return ogMatch[1];

      // Try regular meta name
      const metaMatch = html.match(new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i'))
        || html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${property}["']`, 'i'));
      if (metaMatch) return metaMatch[1];

      return '';
    };

    const title = getMetaContent(html, 'title') 
      || (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || '').trim();
    
    const image = getMetaContent(html, 'image')
      || getMetaContent(html, 'image:src');

    const description = getMetaContent(html, 'description');

    // Try to extract author from various sources
    const author = getMetaContent(html, 'author')
      || getMetaContent(html, 'book:author')
      || (html.match(/by\s+<[^>]*>([^<]+)</i)?.[1] || '').trim();

    // Clean up title - remove site name suffixes
    const cleanTitle = title
      .replace(/\s*[-–|:]\s*(Amazon|Goodreads|Google Books|Saraiva|Magazine Luiza|Submarino).*$/i, '')
      .replace(/\s*\([^)]*\)\s*$/, '')
      .trim();

    const result = {
      success: true,
      data: {
        title: cleanTitle,
        author,
        cover: image,
        description: description?.slice(0, 500),
      },
    };

    console.log('Metadata extracted:', { title: cleanTitle, author, hasImage: !!image });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch metadata' 
    }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
