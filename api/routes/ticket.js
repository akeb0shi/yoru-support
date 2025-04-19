const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const requireAuth = require('../middleware/requireAuth');

const prisma = new PrismaClient();

// Create a new ticket
router.post('/', requireAuth, async (req, res) => {
  const { subject, message, orderNumber } = req.body;

  if (!subject || !message || !orderNumber) {
    return res.status(400).json({ error: 'Subject, message, and order number are required' });
  }

  // check for 3 open ticket limit (if customer) (support has auto-bypass)
  const openCount = await prisma.ticket.count({
    where: {
      orderNumber: parseInt(orderNumber),
      status: 'OPEN'
    }
  });

  if (openCount >= 3 && req.user.role !== 'SUPPORT') {
    return res.status(400).json({
      error: 'You already have 3 open tickets for this order. Please wait for support to respond.'
    });
  }

  try {
    const ticket = await prisma.ticket.create({
      data: {
        subject,
        message,
        orderNumber: parseInt(orderNumber),
        userId: req.user.id
      }
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Get all tickets for current user (or all if support)
router.get('/', requireAuth, async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: req.user.role === 'SUPPORT' ? {} : { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Get ticket by ID
router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        replies: {
          include: {
            user: true
          }
        },
        user: true
      }
      
    });

    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    // prevent non-support users from accessing other people's tickets
    if (req.user.role !== 'SUPPORT' && ticket.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// Update status of a ticket
router.patch('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['OPEN', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const ticket = await prisma.ticket.update({
      where: { id },
      data: { status }
    });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

// Delete a ticket (support only)
router.delete('/:id', requireAuth, async (req, res) => {
  if (req.user.role !== 'SUPPORT') {
    return res.status(403).json({ error: 'Only support can delete tickets' });
  }

  try {
    await prisma.ticket.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

module.exports = router;
