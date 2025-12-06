import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import config from "../config";

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }

    
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token!, config.jwtSecret as string) as any;

      req.user = decoded; 

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient role" });
      }

      next(); 
    } catch (err: any) {
      res.status(401).json({ success: false, message: "Invalid token", details: err.message });
    }
  };
};

export default auth;
