import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-gray-400 mb-8">Page not found</p>
      <Link to="/" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
        Go Home
      </Link>
    </div>
  );
}
