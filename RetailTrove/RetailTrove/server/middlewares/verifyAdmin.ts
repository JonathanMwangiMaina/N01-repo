import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Middleware to verify admin access
export function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as any;
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
}