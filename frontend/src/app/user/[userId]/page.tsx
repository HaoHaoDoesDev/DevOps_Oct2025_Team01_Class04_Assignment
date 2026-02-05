"use client";

import { useState, useMemo } from 'react';
import { Images, HardDrive, FolderOpen, Upload as UploadIcon } from 'lucide-react';
import ImageCard from '@/components/ui/image-card';
import UploadZone from './_components/upload-card';
import StatsCard from '@/components/ui/stats-card';
import SearchBar from '@/components/ui/reusable-search';
import EmptyState from './_components/empty-state';
import DeleteConfirmModal from './_components/delete-photo-modal';

// Mock data type
interface ImageData {
  id: string;
  src: string;
  alt: string;
  uploadedAt: Date;
  size: number; // in bytes
}

export default function UserDashboard() {
  // Mock data - replace with your actual data fetching
  const [images, setImages] = useState<ImageData[]>([
    {
      id: '1',
      src: '/api/placeholder/400/400',
      alt: 'Summer vacation photo',
      uploadedAt: new Date('2024-01-15'),
      size: 2048000
    },
    {
      id: '2',
      src: '/api/placeholder/400/400',
      alt: 'Beach sunset',
      uploadedAt: new Date('2024-01-20'),
      size: 1536000
    },
    {
      id: '3',
      src: '/api/placeholder/400/400',
      alt: 'Mountain landscape',
      uploadedAt: new Date('2024-02-01'),
      size: 3072000
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; imageId: string; imageName: string }>({
    isOpen: false,
    imageId: '',
    imageName: ''
  });

  // Filter images based on search
  const filteredImages = useMemo(() => {
    if (!searchQuery) return images;
    return images.filter(img =>
      img.alt.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [images, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalSize = images.reduce((acc, img) => acc + img.size, 0);
    const totalSizeGB = (totalSize / (1024 * 1024 * 1024)).toFixed(2);
    const currentTime = new Date().getTime();
    
    return {
      totalImages: images.length,
      totalSize: totalSizeGB,
      recentUploads: images.filter(img => {
        const daysDiff = (currentTime - img.uploadedAt.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
      }).length
    };
  }, [images]);

  // Handle file upload
  const handleUpload = async (files: File[]) => {
    console.log('Uploading files:', files);
    
    // Mock adding new images
    const newImages: ImageData[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      src: URL.createObjectURL(file),
      alt: file.name.replace(/\.[^/.]+$/, ''),
      uploadedAt: new Date(),
      size: file.size
    }));

    setImages(prev => [...newImages, ...prev]);
  };

  // Handle delete
  const handleDeleteClick = (id: string) => {
    const image = images.find(img => img.id === id);
    if (image) {
      setDeleteModal({
        isOpen: true,
        imageId: id,
        imageName: image.alt
      });
    }
  };

  const handleDeleteConfirm = () => {
    setImages(prev => prev.filter(img => img.id !== deleteModal.imageId));
    console.log('Deleted image:', deleteModal.imageId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Pictures</h1>
              <p className="text-gray-600 mt-1">Manage and organize your image collection</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Images"
            value={stats.totalImages}
            icon={Images}
            color="blue"
          />
          <StatsCard
            title="Storage Used"
            value={`${stats.totalSize} GB`}
            icon={HardDrive}
            color="green"
          />
          <StatsCard
            title="Recent Uploads"
            value={stats.recentUploads}
            icon={UploadIcon}
            color="purple"
          />
        </div>

        {/* Upload Zone */}
        <div className="mb-8">
          <UploadZone onUpload={handleUpload} />
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Images ({filteredImages.length})
            </h2>
          </div>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by image name..."
          />
        </div>

        {/* Images Grid */}
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <ImageCard
                key={image.id}
                id={image.id}
                src={image.src}
                alt={image.alt}
                uploadedAt={image.uploadedAt}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <>
            {searchQuery ? (
              <div className="text-center py-16">
                <FolderOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500">Try searching with different keywords</p>
              </div>
            ) : (
              <EmptyState />
            )}
          </>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, imageId: '', imageName: '' })}
        onConfirm={handleDeleteConfirm}
        imageName={deleteModal.imageName}
      />
    </div>
  );
}