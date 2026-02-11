"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Images,
  HardDrive,
  FolderOpen,
  Upload as UploadIcon,
} from "lucide-react";
import ImageCard from "@/components/ui/image-card";
import UploadZone from "./_components/upload-card";
import StatsCard from "@/components/ui/stats-card";
import SearchBar from "@/components/ui/reusable-search";
import EmptyState from "./_components/empty-state";
import DeleteConfirmModal from "./_components/delete-photo-modal";
import { useAuthStore } from "@/stores/user-store";
import Cookies from "js-cookie";
import { toast } from "sonner";

interface ImageData {
  id: string;
  src: string;
  alt: string;
  uploadedAt: Date;
  size: number;
}

interface UploadedFileRecord {
  id: number;
  user_id: number;
  file_name: string;
  blob_url: string;
  file_size_bytes: number;
  upload_timestamp: string;
}

export default function UserDashboard() {
  const { userId } = useAuthStore();
  const [images, setImages] = useState<ImageData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDownload = async (id: string, fileName: string) => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:5002/dashboard/download/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Download started");
    } catch (error) {
      toast.error("Could not download file");
      console.error(error);
    }
  };

  const fetchUserImages = useCallback(async () => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:5002/dashboard/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch images");

      const result = await response.json();

      const mappedImages: ImageData[] = result.data.map(
        (record: UploadedFileRecord) => ({
          id: record.id.toString(),
          src: record.blob_url,
          alt: record.file_name,
          uploadedAt: new Date(record.upload_timestamp),
          size: record.file_size_bytes,
        }),
      );
      setImages(mappedImages);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(message);
      console.error("Delete error:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserImages();
  }, [fetchUserImages]);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    imageId: string;
    imageName: string;
  }>({
    isOpen: false,
    imageId: "",
    imageName: "",
  });

  const handleDeleteClick = (id: string) => {
    const image = images.find((img) => img.id === id);
    if (image) {
      setDeleteModal({
        isOpen: true,
        imageId: id,
        imageName: image.alt,
      });
    }
  };

  const handleUploadFinished = (uploadedRecords: UploadedFileRecord[]) => {
    const newImages: ImageData[] = uploadedRecords.map((record) => ({
      id: record.id.toString(),
      src: record.blob_url,
      alt: record.file_name,
      uploadedAt: new Date(record.upload_timestamp),
      size: record.file_size_bytes,
    }));

    setImages((prev) => [...newImages, ...prev]);
  };

  const filteredImages = useMemo(() => {
    if (!searchQuery) return images;
    return images.filter((img) =>
      img.alt.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [images, searchQuery]);

  const stats = useMemo(() => {
    const totalSize = images.reduce((acc, img) => acc + img.size, 0);
    const formatSize = (bytes: number) => {
      if (bytes === 0) return "0 MB";
      const mb = bytes / (1024 * 1024);
      if (mb < 1024) return `${mb.toFixed(2)} MB`;
      return `${(mb / 1024).toFixed(2)} MB`;
    };
    const currentTime = new Date().getTime();

    return {
      totalImages: images.length,
      totalSize: formatSize(totalSize),
      recentUploads: images.filter((img) => {
        const daysDiff =
          (currentTime - img.uploadedAt.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
      }).length,
    };
  }, [images]);

  const handleDeleteConfirm = async () => {
    const token = Cookies.get("token");
    const imageId = deleteModal.imageId;

    if (!token || !imageId) return;

    try {
      const response = await fetch(
        `http://localhost:5002/dashboard/delete/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete file");
      }

      setImages((prev) => prev.filter((img) => img.id !== imageId));

      setDeleteModal({ isOpen: false, imageId: "", imageName: "" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(message);
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Pictures</h1>
              <p className="text-gray-600 mt-1">
                Manage and organize your image collection
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Images"
            value={stats.totalImages}
            icon={Images}
            color="blue"
          />
          <StatsCard
            title="Storage Used"
            value={`${stats.totalSize}`}
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

        <UploadZone onUpload={handleUploadFinished} userId={userId || 0} />

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
                onDownload={handleDownload}
              />
            ))}
          </div>
        ) : (
          <>
            {searchQuery ? (
              <div className="text-center py-16">
                <FolderOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-500">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <EmptyState />
            )}
          </>
        )}
      </main>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, imageId: "", imageName: "" })
        }
        onConfirm={handleDeleteConfirm}
        imageName={deleteModal.imageName}
      />
    </div>
  );
}
