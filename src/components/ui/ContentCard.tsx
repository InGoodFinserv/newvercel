import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { Content } from '../../types/content';

interface ContentCardProps {
  content: Content;
  basePath: string;
}

export default function ContentCard({ content, basePath }: ContentCardProps) {
  const date = new Date(content.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const excerpt = content.body
    ? content.body.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={`${basePath}/${content.custom_slug}`}
        className="block group rounded-xl overflow-hidden bg-white border border-gray-200 hover:border-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        {content.image && (
          <div className="aspect-video overflow-hidden">
            <img
              src={content.image}
              alt={content.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <h3 className="text-lg font-semibold text-black group-hover:text-blue-600 transition-colors mb-2">
            {content.title}
          </h3>
          {excerpt && (
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{excerpt}</p>
          )}
          <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
            Read more <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
