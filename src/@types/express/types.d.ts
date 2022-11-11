export {};

declare global {
  namespace Express {
    interface Request {
      tokenData: { id: string; role: 'USER' | 'SUPERADMIN' };
    }
  }
}
