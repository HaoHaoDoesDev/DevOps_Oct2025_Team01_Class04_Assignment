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
}