import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useContentList } from '../hooks/useContentList';
import ContentCard from '../components/ui/ContentCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Pagination from '../components/ui/Pagination';

export default function BlogListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { items, loading, totalPages } = useContentList({
    type: 'blog',
    page,
    perPage: 6,
    search: search || undefined,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-black mb-2">Blog</h1>
        <p className="text-gray-600 mb-8">Insights, stories, and perspectives from our team.</p>
      </motion.div>

      {/* Search */}
      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-blue-500/50 transition-colors"
        />
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No blog posts found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <ContentCard content={post} basePath="/blog" />
              </motion.div>
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
