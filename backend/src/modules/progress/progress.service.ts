import { prisma } from "../../config/database";

export const progressService = {
  async calculate(projectId: string) {
    try {
      const tasks = await prisma.task.findMany({
        where: {
          projectId,
          origin: "USER"
        }
      });

      if (tasks.length === 0) {
        return {
          success: true,
          data: {
            progress: 0
          }
        };
      }

      const totalWeight = tasks.reduce(
        (sum, task) => sum + (task.weight ?? 1),
        0
      );

      const completedWeight = tasks
        .filter(task => task.status === "DONE")
        .reduce((sum, task) => sum + (task.weight ?? 1), 0);

      const progress = Number(
        ((completedWeight / totalWeight) * 100).toFixed(2)
      );

      return {
        success: true,
        data: {
          progress
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to calculate project progress"
      };
    }
  }
};
