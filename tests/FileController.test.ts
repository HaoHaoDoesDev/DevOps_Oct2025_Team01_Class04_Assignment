// __tests__/FileController.test.ts
import { FileController } from "../services/user-service/src/controllers/file-controller.js";
import { FileModel } from "../services/user-service/src/models/File.js";

jest.mock("../services/user-service/src/models/File.js");

describe("FileController", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
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
      const mockFiles = [{ id: 1, name: "test" }];
      (FileModel.getFilesByUserId as jest.Mock).mockResolvedValue(mockFiles);

      await FileController.getAllFiles(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Files retrieved successfully",
        count: 1,
        data: mockFiles,
      });
    });
  });
});