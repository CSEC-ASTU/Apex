import type { Request, Response } from "express";
import {
  UpdateConflictSchema,
  UpdateMissingInformationSchema
} from "./projectData.schema";
import { ProjectDataService } from "./projectData.service";

export const ProjectDataController = {
  async getFunctionalRequirements(req: Request, res: Response) {
    const { projectId } = req.params;
    const result = await ProjectDataService.getFunctionalRequirements(
      projectId,
      req.user!.id
    );
    res.json(result);
  },

  async getNonFunctionalRequirements(req: Request, res: Response) {
    const { projectId } = req.params;
    const result = await ProjectDataService.getNonFunctionalRequirements(
      projectId,
      req.user!.id
    );
    res.json(result);
  },

  async getAddressedMissingInformation(req: Request, res: Response) {
    const { projectId } = req.params;
    const result = await ProjectDataService.getAddressedMissingInformation(
      projectId,
      req.user!.id
    );
    res.json(result);
  },

  async getUnaddressedMissingInformation(req: Request, res: Response) {
    const { projectId } = req.params;
    const result = await ProjectDataService.getUnaddressedMissingInformation(
      projectId,
      req.user!.id
    );
    res.json(result);
  },

  async getResolvedConflicts(req: Request, res: Response) {
    const { projectId } = req.params;
    const result = await ProjectDataService.getResolvedConflicts(
      projectId,
      req.user!.id
    );
    res.json(result);
  },

  async getUnresolvedConflicts(req: Request, res: Response) {
    const { projectId } = req.params;
    const result = await ProjectDataService.getUnresolvedConflicts(
      projectId,
      req.user!.id
    );
    res.json(result);
  },

  async updateMissingInformationStatus(req: Request, res: Response) {
    try {
      const data = UpdateMissingInformationSchema.parse(req.body);
      const { projectId, missingInfoId } = req.params;

      const result = await ProjectDataService.updateMissingInformationStatus(
        projectId,
        missingInfoId,
        req.user!.id,
        data
      );

      res.json(result);
    } catch (error: any) {
      res.json({ success: false, error: error.message });
    }
  },

  async updateConflictStatus(req: Request, res: Response) {
    try {
      const data = UpdateConflictSchema.parse(req.body);
      const { projectId, conflictId } = req.params;

      const result = await ProjectDataService.updateConflictStatus(
        projectId,
        conflictId,
        req.user!.id,
        data
      );

      res.json(result);
    } catch (error: any) {
      res.json({ success: false, error: error.message });
    }
  }
};
