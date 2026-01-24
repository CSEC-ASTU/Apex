import { Router } from "express";
//import { authMiddleware } from "./middlewares/auth.middleware";
import projectRoute from "./modules/projects/projects.routes"
import taskRoute from "./modules/tasks/tasks.routes"
import fileRoute from "./modules/data/data.routes"
import assistant from "./modules/assistant/assistant.routes"
import projectDataRoute from "./modules/projectData/projectData.routes"
import progressRoute from "./modules/progress/progress.route"

export const router = Router();

//router.use("/auth",authRoute)
router.use("/projects", projectRoute)
router.use("/project", fileRoute)
router.use("/assistant", assistant)
router.use("/tasks", taskRoute)
router.use("/project", projectDataRoute)
router.use("/project", progressRoute)

export default router