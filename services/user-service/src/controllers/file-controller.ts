import { type Request, type Response, type NextFunction } from "express";
import { FileModel } from "../models/File.js";

export class FileController {
  static async uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.body) {
       res.status(400).json({ error: "Form body missing" });
      }
      if (!req.file) {
        res.status(400).json({ error: "No file provided" });
        return;
      }
      const userId = (req as any).user.userId;

      const publicUrl = await FileModel.uploadToBucket(userId, req.file);
      const savedRecord = await FileModel.createRecord({
        user_id: userId,
        file_name: req.file.originalname,
        blob_url: publicUrl,
        file_size_bytes: req.file.size,
      });

      res.status(201).json({ message: "Success", data: savedRecord });
    } catch (error) { next(error); }
  }
// controllers/FileController.ts

static async downloadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { fileId } = req.params;
    const userId = (req as any).user.userId;

    const fileRecord = await FileModel.getFileByIdAndUser(Number(fileId), userId);

    if (!fileRecord) {
      res.status(404).json({ error: "File not found or unauthorized" });
      return;
    }

    const rawPath = fileRecord.blob_url.split('/user_uploads/')[1];
    const path = decodeURIComponent(rawPath);

    const fileBuffer = await FileModel.downloadFromBucket(path);

    res.setHeader("Content-Disposition", `attachment; filename="${fileRecord.file_name}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    
    res.send(fileBuffer);
  } catch (error) {
    next(error);
  }
}

static async deleteFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { fileId } = req.params;
    const userId = (req as any).user.userId;

    const blobUrl = await FileModel.deleteFileRecord(Number(fileId), userId);

    if (!blobUrl) {
      res.status(404).json({ error: "File not found or unauthorized" });
      return;
    }

    const rawPath = blobUrl.split('/user_uploads/')[1];
    const path = decodeURIComponent(rawPath);
    
    await FileModel.deleteFromBucket(path);

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    next(error);
  }
}

static async getAllFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = (req as any).user.userId;

    const files = await FileModel.getFilesByUserId(userId);

    res.status(200).json({
      message: "Files retrieved successfully",
      count: files.length,
      data: files 
    });
  } catch (error) {
    next(error);
  }
}
}