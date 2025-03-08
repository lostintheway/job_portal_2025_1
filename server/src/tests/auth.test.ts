import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import HashPassword from "../middleware/HashPassword";
import { authenticate } from "../middleware/auth";
import type { Request, Response, NextFunction } from "express";

// Mock the database and other dependencies
vi.mock("../config/db.ts", () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    then: vi
      .fn()
      .mockImplementation((callback) =>
        callback([{ userId: 1, role: "jobseeker", email: "test@example.com" }])
      ),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn().mockReturnValue({ userId: 1, role: "jobseeker" }),
    sign: vi.fn().mockReturnValue("mock-token"),
  },
}));

vi.mock("../db/schema.ts", () => ({
  users: { userId: { name: "userId" } },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
}));

describe("Authentication System", () => {
  describe("HashPassword", () => {
    it("should generate a salt and hash for a password", () => {
      const password = "securePassword123";
      const { salt, hash } = HashPassword.saltPassword(password);

      expect(salt).toBeDefined();
      expect(salt.length).toBeGreaterThan(0);
      expect(hash).toBeDefined();
      expect(hash.length).toBeGreaterThan(0);
    });

    it("should verify a password correctly with its salt and hash", () => {
      const password = "securePassword123";
      const { salt, hash } = HashPassword.saltPassword(password);

      const isValid = HashPassword.verifyPassword(password, salt, hash);
      expect(isValid).toBe(true);
    });

    it("should reject an incorrect password", () => {
      const password = "securePassword123";
      const wrongPassword = "wrongPassword123";
      const { salt, hash } = HashPassword.saltPassword(password);

      const isValid = HashPassword.verifyPassword(wrongPassword, salt, hash);
      expect(isValid).toBe(false);
    });

    it("should generate different salts for different users", () => {
      const password1 = "securePassword123";
      const password2 = "securePassword123";

      const result1 = HashPassword.saltPassword(password1);
      const result2 = HashPassword.saltPassword(password2);

      expect(result1.salt).not.toEqual(result2.salt);
      expect(result1.hash).not.toEqual(result2.hash);
    });
  });

  describe("JWT Authentication Middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = vi.fn();

    beforeEach(() => {
      mockRequest = {
        headers: {
          authorization: "Bearer valid-token",
        },
      };
      mockResponse = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      };
      nextFunction = vi.fn();
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("should call next() when a valid token is provided", async () => {
      await authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should return 401 when no authorization header is provided", async () => {
      mockRequest.headers = {};
      await authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalled();
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 401 when authorization header does not start with Bearer", async () => {
      mockRequest.headers = { authorization: "invalid-format" };
      await authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalled();
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });
});
