import { Request, Response } from "express";
import { progressService } from "./progress.service";

export const progressController = {
  async getProgress(req: Request, res: Response) {
    try {
      const { projectId } = req.params;

      if (!projectId) {
        return res.status(400).json({
          success: false,
          error: "Project ID is required"
        });
      }

      const result = await progressService.calculate(projectId);

      if (!result.success) {
        return res.status(422).json(result);
      }

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message || "Unexpected error while fetching progress"
      });
    }
  }
};
