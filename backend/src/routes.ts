import { Router } from "express";
//import { authMiddleware } from "./middlewares/auth.middleware";
import projectRoute from "./modules/projects/projects.routes"
import taskRoute from "./modules/tasks/tasks.routes"
import fileRoute from "./modules/data/data.routes"
import assistant from "./modules/assistant/assistant.routes"

export const router = Router();

//router.use("/auth",authRoute)
router.use("/projects", projectRoute)
router.use("/project", fileRoute)
router.use("/assistant", assistant)
router.use("/projects/asks", taskRoute)
export default router