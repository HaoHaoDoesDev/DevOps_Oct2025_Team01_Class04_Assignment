import { supabase } from '../config/supabaseClient.js'; 
import type { Multer } from 'multer';
export interface UserFile {
  id?: number;
  user_id: number;
  file_name: string;
  blob_url: string;
  file_size_bytes: number;
  upload_timestamp?: Date;
}

export class FileModel {

  static async uploadToBucket(userId: number, file: Express.Multer.File): Promise<string> {
    const filePath = `${userId}/${Date.now()}_${file.originalname}`;
    
    const { error: storageError } = await supabase
      .storage
      .from('user_uploads') 
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (storageError) throw new Error(`Storage Upload Failed: ${storageError.message}`);

    const { data } = supabase
      .storage
      .from('user_uploads')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Inserts the file metadata into the SQL "user_files" table
   */
  static async createRecord(fileData: UserFile): Promise<UserFile> {
    const { data, error } = await supabase
      .from('user_files')
      .insert([fileData])
      .select()
      .single();

    if (error) throw new Error(`Database Insert Failed: ${error.message}`);
    
    return data;
  }
}