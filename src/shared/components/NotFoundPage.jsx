import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold text-green-600">404</h1>
      <p className="text-gray-600 mt-2">Page not found</p>
      <Link
        to="/"
        className="inline-block mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Go to Chat
      </Link>
    </div>
  );
}

export default NotFoundPage;