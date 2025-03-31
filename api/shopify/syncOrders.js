const shopify = require('./shopifyClient');
const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');
const prisma = new PrismaClient();

async function syncOrders() {
  const res = await shopify.get('/orders.json');
  const orders = res.data.orders;

  for (const order of orders) {
    // Find existing user by email
    const user = await prisma.user.findUnique({
      where: { email: order.email },
    });

    if (!user) {
      console.warn(`No user found for order ${order.order_number}`);
      continue; // skip this order
    }

    const timeline = await getOrderTimeline(order.id);

    // Upsert: create if new, update if exists
    await prisma.order.upsert({
      where: { orderNumber: order.order_number },
      update: {
        fulfillment: order.fulfillment_status || 'unfulfilled',
        tracking: order.fulfillments?.[0]?.tracking_number || '',
        timeline: timeline || [],
      },
      create: {
        orderNumber: order.order_number,
        userId: user.id, // ✅ links to User
        name: `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim(),
        email: order.email,
        phone: parseInt(order.phone) || null,
        shippingAddress: formatAddress(order.shipping_address),
        billingAddress: formatAddress(order.billing_address),
        fulfillment: order.fulfillment_status || 'unfulfilled',
        tracking: order.fulfillments?.[0]?.tracking_number || '',
        items: order.line_items,
        subtotal: parseFloat(order.subtotal_price),
        shippingCost: parseFloat(order.total_shipping_price_set.shop_money.amount),
        orderRisk: order.order_risk?.[0]?.recommendation || 'low',
        timeline: timeline || [],
      },
    });
  }

  console.log('Orders synced successfully.');
}

// Fetch timeline from Shopify Events API
async function getOrderTimeline(orderId) {
  const response = await fetch(`https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/orders/${orderId}/events.json`, {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_TOKEN,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    console.error(`Failed to fetch timeline for order ${orderId}`);
    return [];
  }

  const data = await response.json();
  return data.events;
}

// Helper: format address as a single string
function formatAddress(addr) {
  if (!addr) return '';
  return `${addr.address1 || ''}, ${addr.city || ''}, ${addr.province || ''} ${addr.zip || ''}, ${addr.country || ''}`.trim();
}

module.exports = syncOrders;
