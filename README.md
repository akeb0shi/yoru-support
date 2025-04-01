website: https://yoru-support.onrender.com/

## Back-end deployed on Render, front-end hosted on Render, Database deployed on Railway

### .env file data is stored on the cloud through Render, it contains a sensitive API token, so it has not been uploaded to Github. Below is the .env file format, with sensitive bits of information redacted. 

#### === DATABASE ===
DATABASE_URL="REDACTED"\

#### === AUTHENTICATION ===
COOKIE_NAME="auth_token"\
COOKIE_SECURE=true\
NODE_ENV=production\
JWT_SECRET="REDACTED"\

#### === SHOPIFY API ===
SHOPIFY_STORE_DOMAIN="yoruapparel.com"\
SHOPIFY_API_TOKEN=REDACTED\

# API ROUTES
### Admin
- **Contains middleware to only allow support roles**
- Get: all tickets
- Get: all users
- Patch: user permissions

### Notification
- Get: all unread messages of current user
- Post: Mark all as read

### Order
- Get: all orders
- Get: specific order

### Reply
- Post: add reply
- Get: all replies

### Ticket
- Post: Create new ticket
- Get: All tickets
    - support: all user tickets
    - user: all of the user's tickets
- Get: Ticket by ID
- Patch: Ticket status
- Delete: Ticket (support only)

### User
- Post: Register new user
- Post: Login
- Post: Logout
- Get: Logged in user's info
