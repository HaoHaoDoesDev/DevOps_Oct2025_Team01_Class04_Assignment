// src/controllers/fileController.ts
import { type Request, type Response, type NextFunction } from "express";
import { FileModel } from "../models/File.js";

export class FileController {
  static async uploadFile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file provided" });
        return;
      }

      // In a real app, you would get this from req.user (JWT), not req.body
      const userId = parseInt(req.body.user_id);
      if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid or missing user_id" });
        return;
      }

      const publicUrl = await FileModel.uploadToBucket(userId, req.file);

      const savedRecord = await FileModel.createRecord({
        user_id: userId,
        file_name: req.file.originalname,
        blob_url: publicUrl,
        file_size_bytes: req.file.size,
      });

      res.status(201).json({
        message: "File uploaded successfully",
        data: savedRecord,
      });
    } catch (error) {
      next(error);
    }
  }
}
