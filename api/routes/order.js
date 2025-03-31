const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const requireAuth = require('../middleware/requireAuth');

const prisma = new PrismaClient();

// Get all orders
router.get('/', requireAuth, async (req, res) => {
  try {
    const where = req.user.role === 'SUPPORT'
      ? {} // all orders
      : { userId: req.user.id }; // only this user's orders

    const orders = await prisma.order.findMany({
      where,
      orderBy: { orderNumber: 'desc' }
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});


  

// get a specific order
router.get('/:orderNumber', requireAuth, async (req, res) => {
  const { orderNumber } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: parseInt(orderNumber) }
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
