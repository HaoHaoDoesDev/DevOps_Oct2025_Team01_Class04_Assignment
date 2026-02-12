jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(),
      insert: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    })),
  })),
}));

import { FileController } from "../services/user-service/src/controllers/file-controller.js";
import { FileModel } from "../services/user-service/src/models/File.js";

jest.mock("../services/user-service/src/models/File.js");

describe("FileController", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks()
    req = {
      body: {},
      file: { originalname: "test.png", size: 100 },
      user: { userId: 1 },
      params: { fileId: "123" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });
  const mockFileRecord = { 
    id: 1, 
    user_id: 1, 
    file_name: "test.png", 
    blob_url: "https://supa.com/user_uploads/test.png",
    file_size_bytes: 1024 
  };
  describe("uploadFile", () => {
    it("should return 201 on success", async () => {
      (FileModel.uploadToBucket as jest.Mock).mockResolvedValue("http://url.com");
      (FileModel.createRecord as jest.Mock).mockResolvedValue({ id: 1 });

      await FileController.uploadFile(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Success" }));
    });

    it("should return 400 if no file is provided", async () => {
      req.file = undefined;
      await FileController.uploadFile(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "No file provided" });
    });
  });

  describe("getAllFiles", () => {
    it("should return 200 and list of files", async () => {
      (FileModel.getFilesByUserId as jest.Mock).mockResolvedValue([mockFileRecord]);

      await FileController.getAllFiles(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Files retrieved successfully",
        count: 1,
        data: [mockFileRecord],
      });
    });
  });

  describe("downloadFile", () => {
    it("should stream the file to the user", async () => {
      const mockFileRecord = { 
        file_name: "test.png", 
        blob_url: "https://supa.com/user_uploads/test.png" 
      };
      (FileModel.getFileByIdAndUser as jest.Mock).mockResolvedValue(mockFileRecord);
      const mockBuffer = Buffer.from("fake-image-content");
      (FileModel.downloadFromBucket as jest.Mock).mockResolvedValue(mockBuffer);
      await FileController.downloadFile(req, res, next);
      expect(res.setHeader).toHaveBeenCalledWith(
        "Content-Disposition", 
        'attachment; filename="test.png"'
      );
      expect(res.setHeader).toHaveBeenCalledWith(
        "Content-Type", 
        "application/octet-stream"
      );
      expect(res.send).toHaveBeenCalledWith(mockBuffer);
    });
    it("should return 404 if file does not exist or belongs to another user", async () => {
      (FileModel.getFileByIdAndUser as jest.Mock).mockResolvedValue(null);

      await FileController.downloadFile(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "File not found or unauthorized" });
  });
  });

describe("deleteFile", () => {
    it("should return 200 and delete from bucket if file exists", async () => {
      const mockBlobUrl = "https://supabase.co/storage/v1/object/public/user_uploads/1/test_file.png";
      (FileModel.deleteFileRecord as jest.Mock).mockResolvedValue(mockBlobUrl);

      (FileModel.deleteFromBucket as jest.Mock).mockResolvedValue(undefined);

      await FileController.deleteFile(req, res, next);

      expect(FileModel.deleteFromBucket).toHaveBeenCalledWith("1/test_file.png");
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "File deleted successfully" });
    });

    it("should return 404 if file record is not found", async () => {

      (FileModel.deleteFileRecord as jest.Mock).mockResolvedValue(null);

      await FileController.deleteFile(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "File not found or unauthorized" });
      
      expect(FileModel.deleteFromBucket).not.toHaveBeenCalled();
    });
  });
});