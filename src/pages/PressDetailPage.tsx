import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, ExternalLink, Tag } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function PressDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { content, loading, error } = useContent(slug!, 'press');

  useEffect(() => {
    if (content) {
      // Update document title
      document.title = content.metadata?.meta_title || content.title;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', content.metadata?.meta_description || content.metadata?.description || '');
      }
      
      // Update meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords && content.metadata?.meta_tags) {
        metaKeywords.setAttribute('content', content.metadata.meta_tags.join(', '));
      }
      
      // Update Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', content.metadata?.meta_title || content.title);
      }
      
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', content.metadata?.meta_description || content.metadata?.description || '');
      }
      
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage && content.image) {
        ogImage.setAttribute('content', content.image);
      }
      
      // Update canonical link
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', `https://ingood.vercel.app/press/${slug}`);
      }
      
      // Add schema if provided
      if (content.metadata?.schema) {
        const existingSchema = document.querySelector('script[type="application/ld+json"]');
        if (existingSchema) {
          existingSchema.remove();
        }
        
        const schemaScript = document.createElement('script');
        schemaScript.type = 'application/ld+json';
        schemaScript.text = content.metadata.schema;
        document.head.appendChild(schemaScript);
      }
    }
  }, [content]);

  if (loading) return <LoadingSpinner />;

  if (error || !content) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-black mb-4">Press Release Not Found</h1>
        <p className="text-gray-600 mb-8">The press release you're looking for doesn't exist.</p>
        <Link to="/press" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 justify-center">
          <ArrowLeft className="w-4 h-4" /> Back to Press
        </Link>
      </div>
    );
  }

  const date = new Date(content.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Link to="/press" className="inline-flex items-center gap-1 text-gray-600 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Press
        </Link>

        {content.image && (
          <div className="aspect-video rounded-xl overflow-hidden mb-8">
            <img src={content.image} alt={content.title} className="w-full h-full object-cover" />
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4">{content.metadata?.h1 || content.title}</h1>

        <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          {content.metadata?.keywords && content.metadata.keywords.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <div className="flex flex-wrap gap-2">
                {content.metadata.keywords.map((kw) => (
                  <span key={kw} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {content.metadata?.external_url && (
          <a
            href={content.metadata.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors mb-8"
          >
            <ExternalLink className="w-4 h-4" /> View External Link
          </a>
        )}

        <div
          className="prose prose-lg max-w-none prose-headings:text-black prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-black"
          dangerouslySetInnerHTML={{ __html: content.body }}
        />
      </motion.div>
    </article>
  );
}
