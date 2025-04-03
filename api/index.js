require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');
const requireAuth = require('./middleware/requireAuth');


const app = express();
const cors = require('cors');
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const allowedOrigins = ['https://yoruapparel.com', 'https://www.yoruapparel.com', 'https://yoru-support.onrender.com', 'https://support-9hv8.onrender.com'];

const userRoutes = require('./routes/user');


// Middleware
// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       console.log('✅ CORS allowed');
//       callback(null, true);
//     } else {
//       console.log('❌ CORS blocked');
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// }));


app.use(cors({
  origin: 'https://yoru-support.onrender.com',
  credentials: true
}));

// app.options('*', cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));

app.use(cookieParser());
app.use(express.json());

app.use('/api', userRoutes);


// Test endpoint
app.get('/ping', (req, res) => {
  res.send({ message: 'pong' });
});

// CREATE A TICKET
app.post('/api/tickets', requireAuth, async (req, res) => {
  const { subject, message, orderNumber } = req.body;

  if (!subject || !message || !orderNumber) {
    return res.status(400).json({ error: 'Subject, message, and order number are required' });
  }

  try {
    // Count open tickets for this order number
    const openTicketCount = await prisma.ticket.count({
      where: {
        orderNumber: parseInt(orderNumber),
        status: 'OPEN'
      }
    });

    // If there are already 3 open tickets, block it
    if (openTicketCount >= 3 && req.user.role !== SUPPORT) {
      return res.status(400).json({
        error: 'You already have 3 open tickets for this order. Feel free to reply to the most relevant open ticket with new information. If you need another ticket open, please let your support agent know so they can open another ticket for you'
      });
    }

    // Create the ticket
    const ticket = await prisma.ticket.create({
      data: {
        subject,
        message,
        orderNumber: parseInt(orderNumber),
        userId: req.user.id,
      }
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
