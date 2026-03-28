import { Newspaper } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Newspaper className="w-5 h-5" />
            <span className="font-semibold">Lumina Press</span>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Lumina Press. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
