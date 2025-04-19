const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const requireAuth = require('../middleware/requireAuth');

const prisma = new PrismaClient();

// Add a reply to a ticket
router.post('/:ticketId', requireAuth, async (req, res) => {
  const { message } = req.body;
  const { ticketId } = req.params;

  if (!message) {
    return res.status(400).json({ error: 'Reply message is required' });
  }

  try {
    // check ticket exists
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    // check permission: only owner or support can reply
    if (req.user.role !== 'SUPPORT' && ticket.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to reply to this ticket' });
    }

    const reply = await prisma.reply.create({
      data: {
        ticketId,
        userId: req.user.id,
        message,
      },
      include: {
        user: true
      }
    });

    res.status(201).json(reply);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send reply' });
  }
});

// Get all replies for a ticket
router.get('/:ticketId', requireAuth, async (req, res) => {
  const { ticketId } = req.params;

  try {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    if (req.user.role !== 'SUPPORT' && ticket.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to view replies for this ticket' });
    }

    const replies = await prisma.reply.findMany({
      where: { ticketId },
      include: {
        user: true
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(replies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch replies' });
  }
});

router.get('/test', (req, res) => {
  res.send('Reply route is working!');
});

module.exports = router;
