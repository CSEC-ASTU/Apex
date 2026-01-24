import { Router } from "express";
import { upload } from "../../config/multer";
import { dataController } from "./data.controller";
import { requireAuth } from "../../middlewares/middleware";

const router = Router();

// All data routes require authentication
router.use(requireAuth);

router.post("/:projectId/upload", upload.single("file"), dataController.uploadFile);
router.post("/:projectId/addTextData", dataController.addTextData);
router.post("/:projectId/add-missing-data", dataController.addMissingData);
router.get("/:projectId/documents", dataController.getDocuments);

export default router;