import { genAI } from "../../../config/genAI";

export const summarizeResponse = async (state: any) => {
    const { emit } = state;

    console.log("   📝 [summarize] Starting response summarization...");

    try {
        const parts: string[] = [];
        const { query } = state;

        if (state.final_DB_Info) {
            parts.push(state.final_DB_Info);
            console.log("   📝 [summarize] Including DB info:", state.final_DB_Info.substring(0, 100) + "...");
        }
        if (state.final_VectorSearch_Info) {
            parts.push(state.final_VectorSearch_Info);
            console.log("   📝 [summarize] Including RAG info:", state.final_VectorSearch_Info.substring(0, 100) + "...");
        }

        console.log("   📝 [summarize] Total data parts:", parts.length);

        if (parts.length === 0) {
            console.log("   📝 [summarize] ⚠️ No data available for summarization");
        }

        emit?.("progress", {
            stage: "summarize",
            message: "Generating final answer"
        });

        console.log("   📝 [summarize] Calling Gemini for final response...");
        const response = await genAI.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `
Answer the user's question using ONLY the provided data.

Rules:
- Plain text only
- No formatting, lists, or symbols
- Clear and concise sentences
- Do not add or guess information
- Give Clear explanation

Question:
${query}

Data:
${parts.join("\n\n")}
      `
        });

        console.log("   📝 [summarize] ✅ Response generated, length:", response.text?.length || 0, "chars");

        return {
            success: true,
            finalResponse: response.text
        };

    } catch (err: any) {
        console.error("   📝 [summarize] ❌ Summarization failed:", err.message);
        console.error("   📝 [summarize] Error details:", err);
        
        emit?.("error", {
            message: "Failed to generate final response", err
        });

        return {
            success: false,
            error: "LLM summarization failed"
        };
    }
};
