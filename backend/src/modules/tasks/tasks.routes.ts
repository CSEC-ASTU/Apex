import { Router } from "express";
import { TasksController } from "./tasks.controller";
import { requireAuth } from "../../middlewares/middleware";

const router = Router();

router.use(requireAuth);

router.post("/:projectId/recommend", TasksController.recommend);
router.post("/:projectId", TasksController.create);
router.get("/:projectId", TasksController.list);
router.put("/:projectId/:taskId", TasksController.update);
router.put("/:projectId/:taskId/own", TasksController.takeOwnership);
router.delete("/:projectId/:taskId", TasksController.remove);

export default router;
