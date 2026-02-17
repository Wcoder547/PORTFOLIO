import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-3xl font-bold text-white mb-4">
          Article Not Found
        </h2>
        <p className="text-white/70 mb-8">
          The article you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
        >
          <FiArrowLeft className="size-4" />
          Back to Articles
        </Link>
      </div>
    </div>
  );
}
