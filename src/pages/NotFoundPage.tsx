import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-gray-600 mb-8">Page not found</p>
      <Link to="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
        Go Home
      </Link>
    </div>
  );
}
