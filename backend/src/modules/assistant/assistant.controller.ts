import { Request, Response } from "express";
import { assistantAgent } from "../../agents/graphs/assistantGraph";
import { createSSEEmitter } from "../../utils/sse";

export const assistantController = {
  async answerUserQuery(req: Request, res: Response) {
    const startTime = Date.now();
    console.log("\n🤖 ========== ASSISTANT REQUEST ==========");
    console.log(`🤖 [${new Date().toISOString()}] New chat request`);
    
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const emit = createSSEEmitter(res);

    const { query } = req.body;
    const rawProjectId = req.params.projectId;
    const projectId = Array.isArray(rawProjectId)
      ? rawProjectId[0]
      : rawProjectId;
    const userId = req.user!.id;

    console.log("🤖 User ID:", userId);
    console.log("🤖 Project ID:", projectId);
    console.log("🤖 Query:", query);

    if (!query) {
      console.log("🤖 ❌ Error: Query is required");
      emit("error", { message: "Query is required." });
      return res.end();
    }

    if (!projectId) {
      console.log("🤖 ❌ Error: Project ID is required");
      emit("error", { message: "Project ID is required." });
      return res.end();
    }

    console.log("🤖 ✅ Validation passed, starting assistant agent...");
    emit("progress", {
      stage: "start",
      message: "Assistant started"
    });

    try {
      console.log("🤖 ⏳ Invoking assistant agent...");
      const result = await assistantAgent.invoke({
        query,
        projectId,
        userId,
        emit
      });

      const duration = Date.now() - startTime;
      console.log(`🤖 ✅ Assistant completed in ${duration}ms`);
      console.log("🤖 Response length:", result.finalResponse?.length || 0, "chars");
      console.log("🤖 Response preview:", result.finalResponse?.substring(0, 200) + "...");

      emit("final", {
        success: true,
        response: result.finalResponse
      });

      console.log("🤖 ========== REQUEST COMPLETE ==========\n");
      res.end();

    } catch (err: any) {
      const duration = Date.now() - startTime;
      console.error(`🤖 ❌ Assistant error after ${duration}ms:`, err.message);
      console.error("🤖 Error stack:", err.stack);

      emit("error", {
        message: err?.message || "Unexpected server error"
      });

      console.log("🤖 ========== REQUEST FAILED ==========\n");
      res.end();
    }
  }
};
