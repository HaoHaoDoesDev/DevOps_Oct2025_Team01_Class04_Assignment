import { FileModel } from "../services/user-service/src/models/File.js";
import { db } from "../services/user-service/src/config/db.js";
import { supabase } from "../services/user-service/src/config/supabaseClient.js";

jest.mock("../services/user-service/src/config/db.js");
jest.mock("../services/user-service/src/config/supabaseClient.js", () => ({
    supabase: {
        storage: {
            from: jest.fn().mockReturnThis(),
            upload: jest.fn(),
            getPublicUrl: jest.fn(),
            download: jest.fn(),
            remove: jest.fn(),
        },
    },
}));

describe("FileModel", () => {
  const mockFile = {
    originalname: "test.png",
    buffer: Buffer.from("test"),
    mimetype: "image/png",
    size: 100,
  } as Express.Multer.File;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("uploadToBucket", () => {
    it("should return publicUrl on successful upload", async () => {
      (supabase.storage.from("").upload as jest.Mock).mockResolvedValue({ error: null });
      (supabase.storage.from("").getPublicUrl as jest.Mock).mockReturnValue({
        data: { publicUrl: "http://example.com/test.png" },
      });

      const url = await FileModel.uploadToBucket(1, mockFile);
      expect(url).toBe("http://example.com/test.png");
      expect(supabase.storage.from).toHaveBeenCalledWith("user_uploads");
    });

    it("should throw error if upload fails", async () => {
      (supabase.storage.from("").upload as jest.Mock).mockResolvedValue({
        error: { message: "Upload Error" },
      });

      await expect(FileModel.uploadToBucket(1, mockFile)).rejects.toThrow("Storage Upload Failed: Upload Error");
    });
  });

  describe("getFilesByUserId", () => {
    it("should return rows from database", async () => {
      const mockRows = [{ id: 1, file_name: "file.txt" }];
      (db.query as jest.Mock).mockResolvedValue({ rows: mockRows });

      const result = await FileModel.getFilesByUserId(1);
      expect(result).toEqual(mockRows);
      expect(db.query).toHaveBeenCalled();
    });
  });
});