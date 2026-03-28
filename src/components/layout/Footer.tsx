export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img 
              src="https://ingood.in/wp-content/uploads/2025/07/ingood-new-logo.png" 
              alt="InGood Logo" 
              className="h-8 w-auto"
            />
          </div>
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} InGood. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
