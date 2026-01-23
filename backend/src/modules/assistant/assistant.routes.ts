import { Router } from "express";
import { assistantController } from "./assistant.controller";
import { requireAuth } from "../../middlewares/middleware";

const router = Router();

// All assistant routes require authentication
router.use(requireAuth);

router.post("/:projectId/ask-function", assistantController.answerUserQuery);

export default router;
