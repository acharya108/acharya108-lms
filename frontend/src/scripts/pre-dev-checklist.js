// src/scripts/pre-dev-checklist.js
import { getSessionContext } from '../lib/context/session-starter.js'

async function preDevChecklist() {
  console.log('🚀 PRE-DEVELOPMENT CHECKLIST')
  console.log('============================\n')
  
  const context = await getSessionContext()
  console.log(context)
  
  console.log('\n📋 CHECKLIST:')
  console.log('✅ Review DecisionLog table in Prisma Studio')
  console.log('✅ Remember: NO re-discussing settled architecture') 
  console.log('✅ Focus on BUILDING features, not changing stack')
  console.log('✅ Log new decisions when making important choices')
  console.log('✅ Use captured utilities for consistency')
  
  console.log('\n🎯 READY TO BUILD!')
}

preDevChecklist()