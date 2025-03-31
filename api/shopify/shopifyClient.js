const axios = require('axios');

const store = '4550f1-2'; // yoruapparel
const accessToken = process.env.SHOPIFY_ADMIN_TOKEN;

const headers = {
  'X-Shopify-Access-Token': accessToken,
  'Content-Type': 'application/json',
};

const baseURL = `https://${store}.myshopify.com/admin/api/2025-01`;

const shopifyClient = axios.create({
  baseURL,
  headers,
});

module.exports = shopifyClient;
