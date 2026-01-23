import { Router } from "express";
import { ProjectsController } from "./projects.controller";
import { requireAuth } from "../../middlewares/middleware";

const router = Router();

// All project routes require authentication
router.use(requireAuth);

router.post("/", ProjectsController.create);
router.get("/", ProjectsController.list);
router.get("/:projectId", ProjectsController.getById);
router.put("/:projectId", ProjectsController.update);
router.delete("/:projectId", ProjectsController.remove);

export default router;