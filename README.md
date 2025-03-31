## .env file data is stored on the cloud through Render, it contains a sensitive API token, so it has not been uploaded to Github. Below is the .env file format, with sensitive bits of information redacted. 


# === DATABASE ===
DATABASE_URL="REDACTED"

# === AUTHENTICATION ===
COOKIE_NAME="auth_token"
COOKIE_SECURE=true
NODE_ENV=production
JWT_SECRET="REDACTED"

# === SHOPIFY API ===
SHOPIFY_STORE_DOMAIN="yoruapparel.com"
SHOPIFY_API_TOKEN=REDACTED
