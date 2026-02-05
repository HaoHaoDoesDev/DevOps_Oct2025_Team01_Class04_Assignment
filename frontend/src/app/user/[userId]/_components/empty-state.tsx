import { ImageIcon } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gray-100 rounded-full p-6 mb-4">
        <ImageIcon className="w-16 h-16 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No pictures yet
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        Upload your first image to get started. You can drag and drop files or click the upload area above.
      </p>
    </div>
  );
}