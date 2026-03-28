export type ContentType = 'blog' | 'press' | 'page';
export type ContentStatus = 'draft' | 'published';

export interface ContentMetadata {
  description?: string;
  keywords?: string[];
  external_url?: string;
  // SEO Fields
  h1?: string;
  meta_title?: string;
  meta_description?: string;
  meta_tags?: string[];
  schema?: string;
  [key: string]: unknown;
}

export interface Content {
  id: string;
  type: ContentType;
  title: string;
  custom_slug: string;
  image: string | null;
  body: string;
  metadata: ContentMetadata;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface ContentInput {
  type: ContentType;
  title: string;
  custom_slug: string;
  image?: string | null;
  body: string;
  metadata?: ContentMetadata;
  status?: ContentStatus;
}
