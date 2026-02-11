import { login } from "../services/admin-service/src/controllers/auth-controller.js";
import { createUserAccount, removeUserAccount } from "../services/admin-service/src/controllers/user-controller.js";
import * as UserModel from "../services/admin-service/src/models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../services/admin-service/src/models/User.js");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("UserController", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("login", () => {
    it("should return 200 and a token on successful login", async () => {
      req.body = { email: "test@test.com", password: "password123" };
      const mockUser = { id: 1, email: "test@test.com", password_hash: "hashed", role: "USER" };

      (UserModel.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("fake-jwt-token");

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        token: "fake-jwt-token",
        role: "USER",
        userId: 1,
        message: "Login successful",
      });
    });

    it("should return 401 if user is not found", async () => {
      req.body = { email: "wrong@test.com", password: "password" };
      (UserModel.findUserByEmail as jest.Mock).mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });

    it("should return 401 if password does not match", async () => {
      req.body = { email: "test@test.com", password: "wrong-password" };
      (UserModel.findUserByEmail as jest.Mock).mockResolvedValue({ password_hash: "hash" });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe("createUserAccount", () => {
    it("should return 201 when user is created successfully", async () => {
      req.body = { email: "new@test.com", password: "password123", role: "ADMIN" };
      
      (UserModel.findUserByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPass");
      (UserModel.createUser as jest.Mock).mockResolvedValue({ id: 2, email: "new@test.com" });

      await createUserAccount(req, res);

      expect(UserModel.createUser).toHaveBeenCalledWith("new@test.com", "hashedPass", "ADMIN");
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should return 400 if user already exists", async () => {
      req.body = { email: "exists@test.com" };
      (UserModel.findUserByEmail as jest.Mock).mockResolvedValue({ id: 1 });

      await createUserAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
    });
  });

  describe("removeUserAccount", () => {
    it("should return 200 on successful deletion", async () => {
      req.params.id = "1";
      (UserModel.deleteUserById as jest.Mock).mockResolvedValue(true);

      await removeUserAccount(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: "User deleted successfully" });
    });

    it("should return 404 if user to delete is not found", async () => {
      req.params.id = "99";
      (UserModel.deleteUserById as jest.Mock).mockResolvedValue(false);

      await removeUserAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});