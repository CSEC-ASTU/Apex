import { Request, Response } from "express";
import { informationAgent } from "../../agents/graphs/informationGraph";
import { vectorAgent } from "../../agents/graphs/vectorGraph";
import { dataService } from "./data.service";
import { textInformationAgent } from "../../agents/graphs/textInfoGraph";
import { textVectorAgent } from "../../agents/graphs/textVectorGraph";
import { prisma } from "../../config/database";

export const dataController = {
    async addTextData(req: Request, res: Response) {
        const { text } = req.body;
        const rawProjectId = req.params.projectId;
        const projectId = Array.isArray(rawProjectId)
            ? rawProjectId[0]
            : rawProjectId;
        const userId = req.user!.id;

        if (!text) {
            return res.status(400).json({
                success: false,
                error: "No text provided."
            });
        }

        if (!projectId) {
            return res.status(400).json({
                success: false,
                error: "Missing projectId."
            });
        }

        try {
            const [infoResult, vectorResult] = await Promise.all([
                textInformationAgent.invoke({
                    text,
                    userId,
                    projectId,
                    success: true
                }),
                textVectorAgent.invoke({
                    text,
                    projectId,
                    success: true
                })
            ]);

            if (!infoResult.success) {
                return res.status(422).json(infoResult.error);
            }

            if (!vectorResult.success) {
                return res.status(422).json(vectorResult);
            }

            return res.status(200).json({
                success: true,
                message: "Text processed successfully",
                info: infoResult.fileSummary,
                chunksStored: vectorResult.chunksStored
            });

        } catch {
            return res.status(500).json({
                success: false,
                error: "Unexpected server error"
            });
        }
    },

    async uploadFile(req: Request, res: Response) {
        try {
            console.log("📤 POST /project/:projectId/upload - File upload request");
            
            const file = req.file;
            const userId = req.user!.id;
            const rawProjectId = req.params.projectId;
            const projectId = Array.isArray(rawProjectId)
                ? rawProjectId[0]
                : rawProjectId;
            
            console.log("   User:", userId);
            console.log("   Project:", projectId);
            console.log("   File:", file ? { name: file.originalname, size: file.size, mimetype: file.mimetype } : "NO FILE");
            
            if (!file) {
                console.log("   ❌ No file uploaded");
                return res.status(400).json({
                    success: false,
                    error: "No file uploaded."
                });
            }

            // Extract file extension for fileType
            const fileExtension = file.originalname.split('.').pop()?.toLowerCase() || 'unknown';

            // 1. Create Document record in database with PENDING status
            console.log("   💾 Creating document record...");
            const document = await prisma.document.create({
                data: {
                    fileName: file.originalname,
                    fileType: fileExtension,
                    status: "PENDING",
                    projectId: projectId,
                }
            });
            console.log("   💾 Document created:", document.id);

            console.log("   ⏳ Processing file with AI agents...");
            
            const [infoResult, vectorResult] = await Promise.all([
                informationAgent.invoke({ file, userId, projectId }),
                vectorAgent.invoke({ file, projectId })
            ]);

            console.log("   📊 Info agent result:", infoResult.success ? "✅ Success" : "❌ Failed");
            console.log("   📊 Vector agent result:", vectorResult.success ? "✅ Success" : "❌ Failed");

            // 2. Update document status based on processing result
            if (!infoResult.success) {
                console.log("   ❌ Info agent error:", infoResult.error);
                
                // Update document status to FAILED
                await prisma.document.update({
                    where: { id: document.id },
                    data: { status: "FAILED" }
                });
                
                return res.status(422).json({
                    success: false,
                    error: infoResult.error,
                    document: { ...document, status: "FAILED" }
                });
            }

            // Vector graph failure should NOT block summary
            if (!vectorResult.success) {
                console.warn("   ⚠️ Vector pipeline failed:", vectorResult.error);
            }

            // 3. Update document status to PROCESSED
            const updatedDocument = await prisma.document.update({
                where: { id: document.id },
                data: { status: "PROCESSED" }
            });

            console.log("   ✅ File processed successfully");
            
            // 4. Return both document and analysis data
            return res.status(200).json({
                success: true,
                data: {
                    document: updatedDocument,
                    analysis: infoResult.fileSummary,
                    vectorized: vectorResult.success
                }
            });

        } catch (error: any) {
            console.error("   ❌ Upload error:", error.message);
            console.error("   Stack:", error.stack);
            return res.status(500).json({
                success: false,
                error: "Internal server error."
            });
        }
    },

    async addMissingData(req: Request, res: Response) {
        const { missingdataId = null, text } = req.body;
        const projectId = req.params.projectId;

        if (!text || typeof text !== "string") {
            return res.status(400).json({
                success: false,
                error: "Text is required",
            });
        }

        if (!projectId) {
            return res.status(400).json({
                success: false,
                error: "Project ID is required",
            });
        }

        const result = await dataService.addMissingData(
            text,
            projectId as string,
            missingdataId
        );

        if (!result.success) {
            return res.status(422).json(result);
        }

        return res.status(200).json(result);
    },
    
    async getDocuments(req: Request, res: Response) {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: "Project ID is required",
      });
    }

    const result = await dataService.getDocuments(projectId);

    if (!result.success) {
      return res.status(422).json(result);
    }

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch documents",
    });
  }
}

};
