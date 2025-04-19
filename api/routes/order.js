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
  const orderNumber = parseInt(req.params.orderNumber);
  const { zip } = req.query;

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // SUPPORT users can always view
    if (req.user.role === 'SUPPORT') {
      return res.json(order);
    }

    // CUSTOMERs must verify zip
    if (!zip || order.shippingAddress?.indexOf(zip) === -1) {
      return res.status(403).json({ error: 'Incorrect ZIP code' });
    }

    return res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to retrieve order info' });
  }
});

module.exports = router;
