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
      const userId = req.body.user_id;
      console.log("User ID from Token:", userId);

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
    const userId = req.body.user_id;

    console.log("Requested File ID:", fileId);
    console.log("User ID from Token:", userId);

    const fileRecord = await FileModel.getFileByIdAndUser(Number(fileId), userId);
    console.log("Database Result:", fileRecord);

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
}