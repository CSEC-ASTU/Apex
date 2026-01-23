import { genAI } from "../../../config/genAI";
import {
  getProjectDataFunctionDeclaration,
  answerQueryFromRAGFunctionDeclaration
} from "../../functionDeclaration.ts/assitant.function";
import { subAssistantDatabaseAgent } from "../../graphs/subAssistantDatabaseGraph";
import { subAssistantRAG_Agent } from "../../graphs/subAssistantRagGraph";

export const findInformationSource = async (state: any) => {
  const { query, projectId, userId, emit } = state;

  console.log("   🔍 [decideSource] Starting information source detection...");
  console.log("   🔍 [decideSource] Query:", query);
  console.log("   🔍 [decideSource] Project:", projectId);

  if (!query) {
    console.log("   🔍 [decideSource] ❌ Query is missing");
    emit?.("error", { message: "Query is missing." });
    return { success: false };
  }

  emit?.("progress", { stage: "analysis", message: "Analyzing user query" });

  let response;
  try {
    console.log("   🔍 [decideSource] Calling Gemini for query analysis...");
    response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this query and decide tools: ${query}`,
      config: {
        tools: [
          {
            functionDeclarations: [
              getProjectDataFunctionDeclaration,
              answerQueryFromRAGFunctionDeclaration
            ]
          }
        ]
      }
    });
    console.log("   🔍 [decideSource] ✅ Gemini analysis completed");
  } catch (err: any) {
    console.error("   🔍 [decideSource] ❌ Gemini analysis failed:", err.message);
    console.error("   🔍 [decideSource] Error details:", err);
    emit?.("error", { message: "Failed to analyze query intent.", err });
    return { success: false };
  }

  const calls = response.functionCalls ?? [];
  console.log("   🔍 [decideSource] Function calls detected:", calls.length);
  calls.forEach((call, i) => {
    console.log(`   🔍 [decideSource] Call ${i + 1}:`, call.name, call.args);
  });

  let dbInfo: string | null = null;
  let ragInfo: string | null = null;

  for (const call of calls) {
    if (call.name === "getProjectData") {
      console.log("   🔍 [decideSource] Executing getProjectData...");
      emit?.("progress", { stage: "db", message: "Fetching structured data" });

      const result = await subAssistantDatabaseAgent.invoke({
        ...call.args,
        projectId,
        userId,
        emit
      });

      console.log("   🔍 [decideSource] DB result success:", result?.success);
      if (result?.success) dbInfo = result.final_DB_Info;
    }

    if (call.name === "answerQueryFromRAG") {
      console.log("   🔍 [decideSource] Executing answerQueryFromRAG...");
      emit?.("progress", { stage: "rag", message: "Searching project documents" });

      const generated_query =
        call.args && typeof (call.args as any).generated_query === "string"
          ? (call.args as any).generated_query
          : undefined;

      console.log("   🔍 [decideSource] Generated query:", generated_query);

      const result = await subAssistantRAG_Agent.invoke({
        query,
        generated_query,
        projectId,
        emit
      });

      console.log("   🔍 [decideSource] RAG result success:", result?.success);
      if (result?.success) ragInfo = result.final_VectorSearch_Info;
    }
  }

  if (!dbInfo && !ragInfo) {
    console.log("   🔍 [decideSource] ⚠️ No relevant data sources found");
    emit?.("progress", {
      stage: "analysis",
      message: "No relevant data sources found"
    });
  }

  console.log("   🔍 [decideSource] ✅ Complete - DB:", !!dbInfo, "RAG:", !!ragInfo);

  return {
    success: true,
    callDB: !!dbInfo,
    callRAG: !!ragInfo,
    final_DB_Info: dbInfo,
    final_VectorSearch_Info: ragInfo
  };
};
