import { NextFunction, Request, Response } from "express";
import { auth } from "../auth";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({ req });

    if (!session) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    req.user = session.user;
    req.session = session;

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({
      success: false,
      error: "Authentication failed",
    });
  }
};
