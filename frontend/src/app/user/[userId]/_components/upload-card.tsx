"use client";

import { useCallback, useState } from "react";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import Cookies from "js-cookie";

// Define the shape of the data returned by your FileController
interface UploadedFileRecord {
  id: number;
  user_id: number;
  file_name: string;
  blob_url: string;
  file_size_bytes: number;
  upload_timestamp: string;
}

interface UploadResponse {
  message: string;
  data: UploadedFileRecord;
}

interface UploadZoneProps {
  onUpload: (uploadedRecords: UploadedFileRecord[]) => void;
  userId: number;
}

interface FileStatus {
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export default function UploadZone({ onUpload, userId }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (files.length > 0) {
      setFileStatuses((prev) => [
        ...prev,
        ...files.map((file) => ({ file, status: "pending" as const })),
      ]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFileStatuses((prev) => [
        ...prev,
        ...files.map((file) => ({ file, status: "pending" as const })),
      ]);
    }
  };

  const removeFile = (index: number) => {
    setFileStatuses((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadSingleFile = async (file: File): Promise<UploadResponse> => {
    const token = Cookies.get("token");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId.toString());

    const response = await fetch("http://localhost:5002/dashboard/upload", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Database or Storage error");
    }

    return response.json();
  };

  const handleUploadClick = async () => {
    if (fileStatuses.length === 0 || !userId) return;

    setIsUploading(true);
    const successfulRecords: UploadedFileRecord[] = [];

    for (let i = 0; i < fileStatuses.length; i++) {
      const fileStatus = fileStatuses[i];
      if (fileStatus.status === "success") continue;

      setFileStatuses((prev) =>
        prev.map((fs, idx) =>
          idx === i ? { ...fs, status: "uploading" as const } : fs,
        ),
      );

      try {
        const result = await uploadSingleFile(fileStatus.file);

        setFileStatuses((prev) =>
          prev.map((fs, idx) =>
            idx === i ? { ...fs, status: "success" as const } : fs,
          ),
        );

        successfulRecords.push(result.data);
      } catch (error) {
        setFileStatuses((prev) =>
          prev.map((fs, idx) =>
            idx === i
              ? {
                  ...fs,
                  status: "error" as const,
                  error:
                    error instanceof Error ? error.message : "Upload failed",
                }
              : fs,
          ),
        );
      }
    }

    setIsUploading(false);

    if (successfulRecords.length > 0) {
      onUpload(successfulRecords);
    }

    const isNotSuccessful = (fs: FileStatus) => fs.status !== "success";

    setTimeout(() => {
      setFileStatuses((prev) => prev.filter(isNotSuccessful));
    }, 2000);
  };

  const getStatusIcon = (status: FileStatus["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "uploading":
        return (
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        );
      default:
        return null;
    }
  };

  const getStatusStyles = (status: FileStatus["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "uploading":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  const pendingCount = fileStatuses.filter(
    (fs) => fs.status === "pending",
  ).length;
  const successCount = fileStatuses.filter(
    (fs) => fs.status === "success",
  ).length;
  const errorCount = fileStatuses.filter((fs) => fs.status === "error").length;

  const fileWord = pendingCount === 1 ? "file" : "files";
  const uploadButtonText = isUploading
    ? "Uploading..."
    : `Upload ${pendingCount} ${fileWord}`;

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50"
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drop your images here, or click to browse
        </p>
        <p className="text-sm text-gray-500">Supports: JPG, PNG, GIF, WebP</p>
      </div>

      {fileStatuses.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-700">
              Files ({fileStatuses.length})
            </p>
            <div className="text-xs space-x-2">
              {successCount > 0 && (
                <span className="text-green-600">{successCount} uploaded</span>
              )}
              {errorCount > 0 && (
                <span className="text-red-600">{errorCount} failed</span>
              )}
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {fileStatuses.map((fileStatus, index) => (
              <div
                key={`${fileStatus.file.name}-${index}`}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${getStatusStyles(fileStatus.status)}`}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="shrink-0 w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                    <Upload className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileStatus.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(fileStatus.file.size / 1024).toFixed(2)} KB
                      {fileStatus.status === "error" &&
                        ` - ${fileStatus.error}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(fileStatus.status)}
                  {fileStatus.status === "pending" && (
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      disabled={isUploading}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleUploadClick}
            disabled={isUploading || pendingCount === 0}
            className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploadButtonText}
          </button>
        </div>
      )}
    </div>
  );
}
