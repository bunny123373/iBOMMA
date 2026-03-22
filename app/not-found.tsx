import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-mirror-darker flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-mirror-primary mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
