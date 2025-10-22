// src/lib/context/session-starter.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Get comprehensive development context for session start
 */
export async function getSessionContext() {
  try {
    const recentDecisions = await prisma.decisionLog.findMany({
      where: {
        OR: [
          { impact: 'high' },
          { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // Get tech stack decisions
    const techDecisions = await prisma.decisionLog.findMany({
      where: {
        category: { in: ['architecture', 'database', 'ai'] }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    const context = `
🧠 DEVELOPMENT CONTEXT - REVIEW BEFORE STARTING:

TECH STACK DECISIONS:
${techDecisions.map(d => `• ${d.title}: ${d.decision}`).join('\n')}

RECENT KEY DECISIONS (Last 7 days):
${recentDecisions.map(d => `• ${d.title}`).join('\n')}

CORE ARCHITECTURE:
• Frontend: React Vite
• Database: Neon PostgreSQL + Prisma  
• AI: Hugging Face Models
• Storage: Cloudflare R2
• Lesson System: 5-level progression
• Content: Rich media with versioning

🚫 NO RE-DISCUSSION NEEDED: Above decisions are final.
🔍 CHECK DecisionLog TABLE for full context.

    `

    return context
  } catch (error) {
    return `⚠️ Context load failed: ${error.message}`
  } finally {
    await prisma.$disconnect()
  }
}

/**
 * Quick context for fast session start
 */
export function getQuickContext() {
  return `
QUICK CONTEXT - DO NOT FORGET:
• Stack: React Vite + Neon PostgreSQL + Hugging Face ✅
• Architecture: 5-level lessons, syllabus versioning ✅  
• Current: Building LMS admin panel
• Memory: DecisionLog system active (10 decisions)
• NO stack/architecture changes - build features instead!
  `.trim()
}

/**
 * Get decisions by category
 */
export async function getDecisionsByCategory(category) {
  try {
    const decisions = await prisma.decisionLog.findMany({
      where: { category },
      orderBy: { createdAt: 'desc' }
    })
    return decisions
  } catch (error) {
    console.error('Error fetching decisions:', error)
    return []
  } finally {
    await prisma.$disconnect()
  }
}