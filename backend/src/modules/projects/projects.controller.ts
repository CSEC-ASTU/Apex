import type { Request, Response } from "express";
import { CreateProjectSchema, UpdateProjectSchema } from "./projects.schema";
import { ProjectsService } from "./projects.sevice";
import { ZodError } from "zod";

export const ProjectsController = {
  async create(req: Request, res: Response) {
    try {
      // Debug logging
      console.log("📝 POST /projects - Create project request");
      console.log("   User:", req.user?.id || "NO USER");
      console.log("   Body:", JSON.stringify(req.body));
      console.log("   Headers Content-Type:", req.headers["content-type"]);

      const userId = req.user!.id;
      const data = CreateProjectSchema.parse(req.body);
      
      console.log("   ✅ Validation passed:", data);

      const project = await ProjectsService.createProject(userId, data);
      console.log("   ✅ Project created:", project.id);

      res.status(201).json({
        success: true,
        data: project,
      });
    } catch (error: any) {
      console.log("   ❌ Error:", error.message);
      
      // Better error handling for Zod validation errors
      if (error instanceof ZodError) {
        const errors = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        console.log("   ❌ Zod validation errors:", errors);
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors,
        });
        return;
      }
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  async list(req: Request, res: Response) {
    try {
      console.log("📝 GET /projects - List projects request");
      console.log("   User:", req.user?.id || "NO USER");
      
      const userId = req.user!.id;
      const projects = await ProjectsService.getUserProjects(userId);
      
      console.log("   ✅ Found", projects.length, "projects");

      res.json({
        success: true,
        data: projects,
      });
    } catch (error: any) {
      console.log("   ❌ Error:", error.message);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { projectId } = req.params;

      const project = await ProjectsService.getProjectById(projectId, userId);

      res.json({
        success: true,
        data: project,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { projectId } = req.params;
      const data = UpdateProjectSchema.parse(req.body);

      const project = await ProjectsService.updateProject(projectId, userId, data);

      res.json({
        success: true,
        data: project,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors,
        });
        return;
      }
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { projectId } = req.params;

      await ProjectsService.deleteProject(projectId, userId);

      res.json({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  },
};
