import { prisma } from "../../config/database";

export const ProjectDataService = {
  async getRequirements(projectId: string, userId: string) {
    try {
      const project = await prisma.project.findFirst({
        where: { id: projectId, userId },
        include: {
          functionalRequirements: true,
          nonFunctionalRequirements: true
        }
      });

      if (!project) {
        return { success: false, error: "Project not found or access denied" };
      }

      return {
        success: true,
        data: {
          functional: project.functionalRequirements,
          nonFunctional: project.nonFunctionalRequirements
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async getMissingInformation(projectId: string, userId: string) {
    try {
      const project = await prisma.project.findFirst({
        where: { id: projectId, userId },
        include: { missingInformation: true }
      });

      if (!project) {
        return { success: false, error: "Project not found or access denied" };
      }

      return {
        success: true,
        data: {
          addressed: project.missingInformation.filter(m => m.addressed),
          unaddressed: project.missingInformation.filter(m => !m.addressed)
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async getConflicts(projectId: string, userId: string) {
    try {
      const project = await prisma.project.findFirst({
        where: { id: projectId, userId },
        include: { conflicts: true }
      });

      if (!project) {
        return { success: false, error: "Project not found or access denied" };
      }

      return {
        success: true,
        data: {
          resolved: project.conflicts.filter(c => c.resolved),
          unresolved: project.conflicts.filter(c => !c.resolved)
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async updateMissingInfoStatus(
    projectId: string,
    missingInfoId: string,
    userId: string,
    data: { addressed: boolean; note?: string }
  ) {
    try {
      const project = await prisma.project.findFirst({
        where: { id: projectId, userId }
      });

      if (!project) {
        return { success: false, error: "Project not found or access denied" };
      }

      const updated = await prisma.missingInformation.update({
        where: { id: missingInfoId },
        data
      });

      return { success: true, data: updated };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async updateConflictStatus(
    projectId: string,
    conflictId: string,
    userId: string,
    data: { resolved: boolean; resolution?: string }
  ) {
    try {
      const project = await prisma.project.findFirst({
        where: { id: projectId, userId }
      });

      if (!project) {
        return { success: false, error: "Project not found or access denied" };
      }

      const updated = await prisma.conflict.update({
        where: { id: conflictId },
        data
      });

      return { success: true, data: updated };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};
