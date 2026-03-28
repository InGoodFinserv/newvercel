import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Content, ContentInput, ContentType } from '../types/content';

interface UseAdminReturn {
  items: Content[];
  loading: boolean;
  error: string | null;
  fetchAll: (type?: ContentType) => Promise<void>;
  create: (input: ContentInput) => Promise<Content | null>;
  update: (id: string, input: Partial<ContentInput>) => Promise<Content | null>;
  remove: (id: string) => Promise<boolean>;
}

export function useAdmin(): UseAdminReturn {
  const [items, setItems] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async (type?: ContentType) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('contents')
        .select('*')
        .order('updated_at', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error: queryError } = await query;
      if (queryError) throw queryError;

      setItems(data as Content[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (input: ContentInput): Promise<Content | null> => {
    try {
      const { data, error: insertError } = await supabase
        .from('contents')
        .insert([input])
        .select()
        .single();

      if (insertError) throw insertError;
      return data as Content;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create content');
      return null;
    }
  }, []);

  const update = useCallback(async (id: string, input: Partial<ContentInput>): Promise<Content | null> => {
    try {
      const { data, error: updateError } = await supabase
        .from('contents')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return data as Content;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update content');
      return null;
    }
  }, []);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('contents')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete content');
      return false;
    }
  }, []);

  return { items, loading, error, fetchAll, create, update, remove };
}
