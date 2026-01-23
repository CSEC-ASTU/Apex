import { prisma } from "../../config/database";

export const ProjectDataService = {
  async getFunctionalRequirements(projectId: string, userId: string) {
    try {
      const project = await prisma.project.findFirst({
        where: { id: projectId, userId },
        include: { functionalRequirements: true }
      });

      if (!project) {
        return { success: false, error: "Project not found or access denied" };
      }

      return { success: true, data: project.functionalRequirements };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async getNonFunctionalRequirements(projectId: string, userId: string) {
    try {
      const project = await prisma.project.findFirst({
        where: { id: projectId, userId },
        include: { nonFunctionalRequirements: true }
      });

      if (!project) {
        return { success: false, error: "Project not found or access denied" };
      }

      return { success: true, data: project.nonFunctionalRequirements };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async getAddressedMissingInformation(projectId: string, userId: string) {
    try {
      const data = await prisma.missingInformation.findMany({
        where: {
          projectId,
          addressed: true,
          project: { userId }
        }
      });

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async getUnaddressedMissingInformation(projectId: string, userId: string) {
    try {
      const data = await prisma.missingInformation.findMany({
        where: {
          projectId,
          addressed: false,
          project: { userId }
        }
      });

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async getResolvedConflicts(projectId: string, userId: string) {
    try {
      const data = await prisma.conflict.findMany({
        where: {
          projectId,
          resolved: true,
          project: { userId }
        }
      });

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async getUnresolvedConflicts(projectId: string, userId: string) {
    try {
      const data = await prisma.conflict.findMany({
        where: {
          projectId,
          resolved: false,
          project: { userId }
        }
      });

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async updateMissingInformationStatus(
    projectId: string,
    missingInfoId: string,
    userId: string,
    data: { addressed: boolean; note?: string }
  ) {
    try {
      const exists = await prisma.missingInformation.findFirst({
        where: {
          id: missingInfoId,
          projectId,
          project: { userId }
        }
      });

      if (!exists) {
        return { success: false, error: "Missing information not found" };
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
      const exists = await prisma.conflict.findFirst({
        where: {
          id: conflictId,
          projectId,
          project: { userId }
        }
      });

      if (!exists) {
        return { success: false, error: "Conflict not found" };
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
