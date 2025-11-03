// src/lib/utils/decision-capture.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Capture a new decision in the DecisionLog system
 */
export async function captureNewDecision(decisionData) {
  try {
    const decision = await prisma.decisionLog.create({
      data: {
        ...decisionData,
        participants: ['Developer', 'AI Assistant'],
        dependsOn: decisionData.dependsOn || [],
        madeBy: 'ai-assisted-development',
        reviewedAt: new Date(),
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
      }
    })
    
    console.log(`📝 Decision logged: ${decisionData.title}`)
    return decision
  } catch (error) {
    console.error('❌ Failed to log decision:', error)
    throw error
  }
}

/**
 * Template for new decisions
 */
export const decisionTemplate = {
  title: "",
  description: "",
  decision: "", 
  rationale: "",
  alternativesConsidered: [],
  category: "architecture", // architecture, database, ai, education, ui, content, assessment
  impact: "medium" // low, medium, high
}

/**
 * Update an existing decision
 */
export async function updateDecision(decisionId, updates) {
  try {
    const decision = await prisma.decisionLog.update({
      where: { id: decisionId },
      data: {
        ...updates,
        reviewedAt: new Date()
      }
    })
    
    console.log(`📝 Decision updated: ${decision.title}`)
    return decision
  } catch (error) {
    console.error('❌ Failed to update decision:', error)
    throw error
  }
}

/**
 * Mark a decision as deprecated (replaced by new one)
 */
export async function deprecateDecision(decisionId, replacedById) {
  return await updateDecision(decisionId, {
    status: "deprecated",
    replacedBy: replacedById
  })
}