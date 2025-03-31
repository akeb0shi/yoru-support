const express = require('express');
const router = express.Router();
const { PrismaClient, Role } = require('@prisma/client');
const requireAuth = require('../middleware/requireAuth');

const prisma = new PrismaClient();

// Middleware: Allow only SUPPORT users
function requireSupport(req, res, next) {
  if (req.user.role !== 'SUPPORT') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}



// get all tickets
router.get('/tickets', requireAuth, requireSupport, async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        user: true,
        replies: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// get all users
router.get('/users', requireAuth, requireSupport, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user permissions
router.patch('/users/:id', requireAuth, requireSupport, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!Object.values(Role).includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: { role }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

module.exports = router;
