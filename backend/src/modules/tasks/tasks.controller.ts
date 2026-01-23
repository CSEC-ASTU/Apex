import type { Request, Response } from "express";
import { TasksService } from "./tasks.service";
import { CreateTaskSchema, UpdateTaskSchema } from "./tasks.schema";

export const TasksController = {
  async recommend(req: Request, res: Response) {
    try {
      const { projectId } = req.params;

      // Example AI output (later replace with real agent)
      const recommendedTasks = [
        { title: "Analyze requirements", description: "Extract FR & NFR" },
        { title: "Setup architecture", description: "Define system design" }
      ];

      await TasksService.recommendTasks(projectId, recommendedTasks);

      res.json({ success: true, data: recommendedTasks });
    } catch (error: any) {
      res.json({ success: false, error: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const data = CreateTaskSchema.parse(req.body);

      const task = await TasksService.createTask(projectId, data);

      res.json({ success: true, data: task });
    } catch (error: any) {
      res.json({ success: false, error: error.message });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const { origin: rawOrigin } = req.query;

      let origin: "USER" | "AGENT" | undefined;

      if (Array.isArray(rawOrigin)) {
        return res.status(400).json({
          success: false,
          error: "Invalid origin parameter"
        });
      }

      if (rawOrigin === undefined) {
        origin = undefined;
      } else if (rawOrigin === "USER" || rawOrigin === "AGENT") {
        origin = rawOrigin;
      } else {
        return res.status(400).json({
          success: false,
          error: "Invalid origin parameter"
        });
      }

      const tasks = await TasksService.getTasks(projectId, origin);
      res.json({ success: true, data: tasks });
    } catch (error: any) {
      res.json({ success: false, error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { projectId, taskId } = req.params;
      const data = UpdateTaskSchema.parse(req.body);

      const task = await TasksService.updateTask(taskId, projectId, data);

      if (!task) {
        return res.json({ success: false, error: "Task not found" });
      }

      res.json({ success: true, data: task });
    } catch (error: any) {
      res.json({ success: false, error: error.message });
    }
  },

  async takeOwnership(req: Request, res: Response) {
    try {
      const { projectId, taskId } = req.params;

      const task = await TasksService.takeOwnership(taskId, projectId);

      res.json({ success: true, data: task });
    } catch (error: any) {
      res.json({ success: false, error: error.message });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const { projectId, taskId } = req.params;

      await TasksService.deleteTask(taskId, projectId);

      res.json({ success: true });
    } catch (error: any) {
      res.json({ success: false, error: error.message });
    }
  }
};
