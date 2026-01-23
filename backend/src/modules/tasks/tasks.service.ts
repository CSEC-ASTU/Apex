import { prisma } from "../../config/database";

export const TasksService = {
  /** Agent creates recommended tasks */
  async recommendTasks(projectId: string, tasks: any[]) {
    return prisma.task.createMany({
      data: tasks.map(task => ({
        title: task.title,
        description: task.description,
        weight: task.weight ?? 1,
        origin: "AGENT",
        projectId
      }))
    });
  },

  /** User adds own task or edits recommended one */
  async createTask(projectId: string, data: any) {
    return prisma.task.create({
      data: {
        ...data,
        origin: data.origin ?? "USER",
        projectId
      }
    });
  },

  /** Fetch tasks by origin */
  async getTasks(projectId: string, origin?: "USER" | "AGENT") {
    return prisma.task.findMany({
      where: {
        projectId,
        ...(origin ? { origin } : {})
      },
      orderBy: { createdAt: "desc" }
    });
  },

  /** Update task (status, content, or ownership) */
  async updateTask(taskId: string, projectId: string, data: any) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, projectId }
    });

    if (!task) return null;

    return prisma.task.update({
      where: { id: taskId },
      data
    });
  },

  /** Convert AGENT task to USER task */
  async takeOwnership(taskId: string, projectId: string) {
    return prisma.task.update({
      where: { id: taskId },
      data: { origin: "USER" }
    });
  },

  async deleteTask(taskId: string, projectId: string) {
    return prisma.task.deleteMany({
      where: { id: taskId, projectId }
    });
  }
};
