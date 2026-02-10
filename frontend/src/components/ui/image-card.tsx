import Image from "next/image";
import { Trash2 } from "lucide-react";

interface ImageCardProps {
  id: string;
  src: string;
  alt: string;
  uploadedAt: Date;
  onDelete: (id: string) => void;
}

export default function ImageCard({
  id,
  src,
  alt,
  uploadedAt,
  onDelete,
}: ImageCardProps) {
  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-3 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{alt}</p>
          <p className="text-xs text-gray-500">
            {uploadedAt.toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={() => onDelete(id)}
          className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
          aria-label="Delete image"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
