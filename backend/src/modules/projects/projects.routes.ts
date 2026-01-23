import { Router } from "express";
import { ProjectsController } from "./projects.controller";

const router = Router();

//router.use(/**authMiddleware */);

router.post("/", ProjectsController.create);
router.get("/", ProjectsController.list);
router.get("/:projectId", ProjectsController.getById);
router.put("/:projectId", ProjectsController.update);
router.delete("/:projectId", ProjectsController.remove);

export default router;