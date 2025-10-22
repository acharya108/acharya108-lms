// src/scripts/test-decision-system.js
import { getQuickContext, getSessionContext } from '../lib/context/session-starter.js'
import { captureNewDecision } from '../lib/utils/decision-capture.js'

async function testDecisionSystem() {
  console.log('🧪 Testing DecisionLog System...\n')
  
  // Test 1: Quick Context
  console.log('1. QUICK CONTEXT:')
  console.log(getQuickContext())
  console.log('\n')
  
  // Test 2: Full Context
  console.log('2. FULL CONTEXT:')
  const fullContext = await getSessionContext()
  console.log(fullContext)
  console.log('\n')
  
  // Test 3: Capture a test decision
  console.log('3. CAPTURING TEST DECISION:')
  try {
    const testDecision = await captureNewDecision({
      title: "Test: DecisionLog System Working",
      description: "Testing the decision capture functionality",
      decision: "DecisionLog system is fully operational",
      rationale: "All utilities created and tested successfully",
      alternativesConsidered: ["No logging", "Manual documentation"],
      category: "architecture",
      impact: "low"
    })
    console.log('✅ Test decision captured successfully!')
  } catch (error) {
    console.log('⚠️ Test decision failed (might already exist):', error.message)
  }
}

testDecisionSystem()