import type { Request, Response } from "express";
import {
    UpdateConflictStatusSchema,
    UpdateMissingInfoStatusSchema
} from "./projectData.schema";
import { ProjectDataService } from "./projectData.service";

export const ProjectDataController = {
    async getRequirements(req: Request, res: Response) {
        const { projectId } = req.params;
        const userId = req.user!.id;

        const result = await ProjectDataService.getRequirements(projectId, userId);
        res.json(result);
    },

    async getMissingInformation(req: Request, res: Response) {
        const { projectId } = req.params;
        const userId = req.user!.id;

        const result = await ProjectDataService.getMissingInformation(projectId, userId);
        res.json(result);
    },

    async getConflicts(req: Request, res: Response) {
        const { projectId } = req.params;
        const userId = req.user!.id;

        const result = await ProjectDataService.getConflicts(projectId, userId);
        res.json(result);
    },

    async updateMissingInfoStatus(req: Request, res: Response) {
        try {
            const { projectId, missingInfoId } = req.params;
            const userId = req.user!.id;
            const data = UpdateMissingInfoStatusSchema.parse(req.body);

            const result = await ProjectDataService.updateMissingInfoStatus(
                projectId,
                missingInfoId,
                userId,
                data
            );

            res.json(result);
        } catch (error: any) {
            res.json({ success: false, error: error.message });
        }
    },

    async updateConflictStatus(req: Request, res: Response) {
        try {
            const { projectId, conflictId } = req.params;
            const userId = req.user!.id;
            const data = UpdateConflictStatusSchema.parse(req.body);

            const result = await ProjectDataService.updateConflictStatus(
                projectId,
                conflictId,
                userId,
                data
            );

            res.json(result);
        } catch (error: any) {
            res.json({ success: false, error: error.message });
        }
    }
};
