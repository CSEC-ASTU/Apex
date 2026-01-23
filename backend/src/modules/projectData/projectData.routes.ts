import { Router } from "express";
import { requireAuth } from "../../middlewares/middleware";
import { ProjectDataController } from "./projectData.controller";

const router = Router();

router.use(requireAuth);

// Requirements
router.get("/:projectId/requirements/functional", ProjectDataController.getFunctionalRequirements);
router.get("/:projectId/requirements/non-functional", ProjectDataController.getNonFunctionalRequirements);

// Missing Information
router.get("/:projectId/missing-information/addressed", ProjectDataController.getAddressedMissingInformation);
router.get("/:projectId/missing-information/unaddressed", ProjectDataController.getUnaddressedMissingInformation);

// Conflicts
router.get("/:projectId/conflicts/resolved", ProjectDataController.getResolvedConflicts);
router.get("/:projectId/conflicts/unresolved", ProjectDataController.getUnresolvedConflicts);

// Status updates
router.patch(
  "/:projectId/missing-information/:missingInfoId",
  ProjectDataController.updateMissingInformationStatus
);

router.patch(
  "/:projectId/conflicts/:conflictId",
  ProjectDataController.updateConflictStatus
);

export default router;
