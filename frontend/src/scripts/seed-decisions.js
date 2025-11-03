// src/scripts/seed-decisions.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ourPastDecisions = [
  {
    title: "Tech Stack: React Vite + Neon + Hugging Face",
    description: "Core technology stack selection for the LMS platform",
    decision: "Use React Vite, Neon PostgreSQL, Prisma ORM, Hugging Face AI, Cloudflare R2",
    rationale: "Cost-effective, scalable, modern stack with zero initial costs and excellent developer experience",
    alternativesConsidered: ["React + Express", "Firebase", "OpenAI APIs", "AWS/Azure", "Railway/Render"],
    category: "architecture",
    impact: "high"
  },
  {
    title: "Database: Neon PostgreSQL with Prisma",
    description: "Database selection with branching capabilities",
    decision: "Neon PostgreSQL as primary database with Prisma ORM",
    rationale: "Instant branching for syllabus versioning, excellent Prisma compatibility, serverless performance",
    alternativesConsidered: ["SQLite", "Railway PostgreSQL", "Supabase", "MongoDB"],
    category: "database", 
    impact: "high"
  },
  {
    title: "AI: Hugging Face over Paid APIs",
    description: "AI evaluation system selection",
    decision: "Use Hugging Face free models for answer evaluation and content generation",
    rationale: "Zero cost for AI services, customizable models, data privacy, suitable for Indian student budget constraints",
    alternativesConsidered: ["OpenAI GPT-4", "Google Gemini", "Azure AI", "Anthropic Claude"],
    category: "ai",
    impact: "medium"
  },
  {
    title: "Lesson Structure: 5-Level Progressive System",
    description: "Educational content organization approach",
    decision: "Each lesson has 5 difficulty levels: Foundation, Elementary, Intermediate, Advanced, Expert",
    rationale: "Progressive learning, differentiated instruction, adaptive difficulty, comprehensive coverage",
    alternativesConsidered: ["3 levels", "Single level", "Continuous scaling", "Prerequisite chains"],
    category: "education",
    impact: "high"
  },
  {
    title: "Content Versioning: Syllabus-Based Cloning",
    description: "System for handling syllabus updates year-to-year",
    decision: "Academic program versioning with content cloning for new syllabus years",
    rationale: "Handle CBSE/State Board syllabus changes efficiently, preserve previous versions, minimal content duplication",
    alternativesConsidered: ["Overwrite existing content", "Manual copying", "Separate courses per year"],
    category: "content-management",
    impact: "high"
  },
  {
    title: "Assessment: AI + Rule-Based Hybrid Evaluation",
    description: "Answer evaluation methodology",
    decision: "Combine Hugging Face AI evaluation with rule-based fallback system",
    rationale: "Ensure reliability when AI fails, handle edge cases, provide consistent grading",
    alternativesConsidered: ["Pure AI evaluation", "Manual teacher evaluation", "Simple keyword matching"],
    category: "assessment",
    impact: "medium"
  },
  {
    title: "Media Storage: Cloudflare R2",
    description: "File and media storage solution",
    decision: "Use Cloudflare R2 for video, image, and animation storage",
    rationale: "Zero egress costs, generous free tier, global CDN, S3-compatible API",
    alternativesConsidered: ["AWS S3", "Google Cloud Storage", "Azure Blob Storage", "Self-hosted"],
    category: "storage",
    impact: "medium"
  },
  {
    title: "Authentication: NextAuth.js",
    description: "User authentication system",
    decision: "Implement NextAuth.js with Google OAuth and email authentication",
    rationale: "Built-in with Next.js, secure, extensible, supports multiple providers, zero cost",
    alternativesConsidered: ["Auth0", "Firebase Auth", "Supabase Auth", "Custom JWT system"],
    category: "authentication",
    impact: "medium"
  },
  {
    title: "Rich Content: Multi-Format Support",
    description: "Supported content types in lessons",
    decision: "Support videos, images, animations, formulas, interactive elements, quizzes in content blocks",
    rationale: "Comprehensive learning experience, engage different learning styles, modern educational standards",
    alternativesConsidered: ["Text-only", "PDF-based", "Video-focused", "Minimal media"],
    category: "content",
    impact: "high"
  },
  {
    title: "Frontend: React Vite (NOT Next.js)",
    description: "Correction of frontend framework context",
    decision: "We are using React with Vite, not Next.js",
    rationale: "Previous confusion corrected - maintain Vite configuration",
    alternativesConsidered: ["Next.js", "Create-React-App"],
    category: "architecture",
    impact: "high"
  }
]

async function seedPastDecisions() {
  console.log('📝 Seeding past decisions...')
  
  try {
    for (const decisionData of ourPastDecisions) {
      await prisma.decisionLog.create({
        data: {
          ...decisionData,
          participants: ['Developer', 'AI Assistant'],
          dependsOn: [],
          madeBy: 'ai-assisted-development',
          reviewedAt: new Date(),
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        }
      })
      console.log(`✅ Logged: ${decisionData.title}`)
    }
    
    console.log('🎉 All past decisions captured!')
    console.log('📊 Total decisions logged:', ourPastDecisions.length)
  } catch (error) {
    console.error('❌ Error seeding decisions:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedPastDecisions()