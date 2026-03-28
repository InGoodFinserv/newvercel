import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Content, ContentType } from '../types/content';

interface UseContentListOptions {
  type?: ContentType;
  page?: number;
  perPage?: number;
  search?: string;
}

interface UseContentListReturn {
  items: Content[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  refetch: () => void;
}

export function useContentList(options: UseContentListOptions = {}): UseContentListReturn {
  const { type, page = 1, perPage = 6, search } = options;
  const [items, setItems] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('contents')
        .select('*', { count: 'exact' })
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,body.ilike.%${search}%`);
      }

      // Pagination
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      query = query.range(from, to);

      const { data, error: queryError, count } = await query;

      if (queryError) throw queryError;

      setItems(data as Content[]);
      setTotalCount(count ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  }, [type, page, perPage, search]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    items,
    loading,
    error,
    totalCount,
    totalPages: Math.ceil(totalCount / perPage),
    refetch: fetchContent,
  };
}
