import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useContentList } from '../hooks/useContentList';
import ContentCard from '../components/ui/ContentCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function HomePage() {
  const { items: blogs, loading: blogsLoading } = useContentList({ type: 'blog', perPage: 3 });
  const { items: press, loading: pressLoading } = useContentList({ type: 'press', perPage: 2 });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <img 
              src="https://ingood.in/wp-content/uploads/2025/07/ingood-new-logo.png" 
              alt="InGood Logo" 
              className="h-24 w-auto mx-auto"
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-black mb-6 tracking-tight"
          >
            InGood: Helps You Invest Smarter
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Your source for cutting-edge insights, press releases, and stories that shape the future of digital media.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/blog"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Read the Blog <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/press"
              className="px-8 py-4 border border-gray-300 hover:border-blue-500 text-black font-medium rounded-lg transition-colors"
            >
              Press Releases
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-black">Latest from the Blog</h2>
          <Link to="/blog" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {blogsLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ContentCard content={blog} basePath="/blog" />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Latest Press Releases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-200">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-black">Press Releases</h2>
          <Link to="/press" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {pressLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {press.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ContentCard content={item} basePath="/press" />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
