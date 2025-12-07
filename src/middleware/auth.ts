import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const header = req.headers.authorization;
      if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = header.split(" ")[1];

      const decoded:any = jwt.verify(token as any, config.jwtSecret as string);

      // console.log("Decoded JWT:", decoded); 

      req.user = {
        id: decoded.id,      
        name: decoded.name,
        email: decoded.email,
        role: decoded.role
      };

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err: any) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

export default auth;
