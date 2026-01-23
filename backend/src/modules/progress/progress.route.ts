import { Router } from "express";
import { progressController } from "./progress.controller";

const router = Router();

router.get("/:projectId/get-progress",progressController.getProgress);

export default router;