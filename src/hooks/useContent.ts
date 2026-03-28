import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Content } from '../types/content';

interface UseContentReturn {
  content: Content | null;
  loading: boolean;
  error: string | null;
}

export function useContent(slug: string, type?: string): UseContentReturn {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('contents')
          .select('*')
          .eq('custom_slug', slug)
          .eq('status', 'published');

        if (type) {
          query = query.eq('type', type);
        }

        const { data, error: queryError } = await query.single();

        if (queryError) throw queryError;

        setContent(data as Content);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Content not found');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchContent();
    }
  }, [slug, type]);

  return { content, loading, error };
}
