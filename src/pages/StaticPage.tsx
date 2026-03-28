import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function StaticPage() {
  const { slug } = useParams<{ slug: string }>();
  const { content, loading, error } = useContent(slug!, 'page');

  if (loading) return <LoadingSpinner />;

  if (error || !content) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-black mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 justify-center">
          <ArrowLeft className="w-4 h-4" /> Go Home
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
        <Link to="/" className="inline-flex items-center gap-1 text-gray-600 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>

        {content.image && (
          <div className="aspect-video rounded-xl overflow-hidden mb-8">
            <img src={content.image} alt={content.title} className="w-full h-full object-cover" />
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4">{content.title}</h1>

        <div className="flex items-center gap-2 text-gray-600 text-sm mb-8">
          <Calendar className="w-4 h-4" />
          <span>Last updated {date}</span>
        </div>

        <div
          className="prose prose-lg max-w-none prose-headings:text-black prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-black"
          dangerouslySetInnerHTML={{ __html: content.body }}
        />
      </motion.div>
    </article>
  );
}
