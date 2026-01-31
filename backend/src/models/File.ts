import { supabase } from "../config/supabaseClient.js";
import { db } from "../config/db.js";
export interface UserFile {
  id?: number;
  user_id: number;
  file_name: string;
  blob_url: string;
  file_size_bytes: number;
  upload_timestamp?: Date;
}

export class FileModel {
  static async uploadToBucket(
    userId: number,
    file: Express.Multer.File,
  ): Promise<string> {
    const filePath = `${userId}/${Date.now()}_${file.originalname}`;

    const { error: storageError } = await supabase.storage
      .from("user_uploads")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (storageError)
      throw new Error(`Storage Upload Failed: ${storageError.message}`);

    const { data } = supabase.storage
      .from("user_uploads")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  static async createRecord(fileData: UserFile): Promise<UserFile> {
    const sql = `
      INSERT INTO user_files (user_id, file_name, blob_url, file_size_bytes)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [
      fileData.user_id,
      fileData.file_name,
      fileData.blob_url,
      fileData.file_size_bytes,
    ];

    try {
      const result = await db.query(sql, values);
      return result.rows[0];
    } catch (error: unknown) {
      // FIX: Extract the message safely, then ALWAYS throw
      const errorMessage = error instanceof Error ? error.message : "Unknown Database Error";
      throw new Error(`Database Insert Failed: ${errorMessage}`);
    }
  }
}
