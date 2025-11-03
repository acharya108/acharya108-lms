// src/routes/decisions.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all decisions
router.get('/', async (req, res) => {
  try {
    const decisions = await prisma.decision.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(decisions);
  } catch (error) {
    console.error('Error fetching decisions:', error);
    res.status(500).json({ error: 'Failed to fetch decisions' });
  }
});

// CREATE new decision
router.post('/', async (req, res) => {
  try {
    const { title, description, decision, rationale, category, impact } = req.body;
    
    const newDecision = await prisma.decision.create({
      data: {
        title,
        description,
        decision,
        rationale,
        category,
        impact
      }
    });
    
    res.json(newDecision);
  } catch (error) {
    console.error('Error creating decision:', error);
    res.status(500).json({ error: 'Failed to create decision' });
  }
});

module.exports = router;