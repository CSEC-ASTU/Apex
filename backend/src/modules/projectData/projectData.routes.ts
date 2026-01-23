import { Router } from "express";
import { requireAuth } from "../../middlewares/middleware";
import { ProjectDataController } from "./projectData.controller";

const router = Router();

router.use(requireAuth);

router.get("/:projectId/requirements", ProjectDataController.getRequirements);
router.get("/:projectId/missing-information", ProjectDataController.getMissingInformation);
router.get("/:projectId/conflicts", ProjectDataController.getConflicts);

router.patch(
  "/:projectId/missing-information/:missingInfoId",
  ProjectDataController.updateMissingInfoStatus
);

router.patch(
  "/:projectId/conflicts/:conflictId",
  ProjectDataController.updateConflictStatus
);

export default router;
