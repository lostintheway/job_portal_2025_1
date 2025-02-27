// your-project/src/types/express.d.ts

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: number;
        role: string;
      };
    }
  }
}

export {};
