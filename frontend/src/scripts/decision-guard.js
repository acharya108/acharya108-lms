// src/scripts/decision-guard.js
import { getDecisionsByCategory } from '../lib/context/session-starter.js'

async function checkDecision(topic) {
  const architectureDecisions = await getDecisionsByCategory('architecture')
  const relevant = architectureDecisions.filter(d => 
    d.title.toLowerCase().includes(topic.toLowerCase()) ||
    d.decision.toLowerCase().includes(topic.toLowerCase())
  )
  
  if (relevant.length > 0) {
    console.log('🚨 DECISION ALREADY MADE:')
    relevant.forEach(decision => {
      console.log(`📌 ${decision.title}`)
      console.log(`✅ Decision: ${decision.decision}`)
      console.log(`🎯 Rationale: ${decision.rationale}`)
      console.log('---')
    })
    return false // Decision already exists
  }
  return true // No decision found, can discuss
}