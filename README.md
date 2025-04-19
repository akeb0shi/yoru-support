website: https://yoru-support.onrender.com/

## Part 2 submission `git commit -m` comment
"Merge branch 'main' of https://github.com/akeb0shi/yoru-support"

## Sample logins
**Admin login (can view all tickets)**\
U: yoru.yarns@gmail.com\
P: Woah!ThisWorks_556

**User login (can only see their ticket)**\
U: dylan.z.kao@gmail.com\
P: 12345

**User login 2 (they do not have any tickets)**\
U: watson.maung@gmail.com\
P: 1qaz2wsx

## Back-end deployed on Render, front-end hosted on Render, Database deployed on Railway

## .env file data is stored on the cloud through Render, it contains a sensitive API token, so it has not been uploaded to Github. Below is the .env file format, with sensitive bits of information redacted. 

#### === DATABASE ===
DATABASE_URL="REDACTED"

#### === AUTHENTICATION ===
COOKIE_NAME="auth_token"\
COOKIE_SECURE=true\
NODE_ENV=production\
JWT_SECRET="REDACTED"

#### === SHOPIFY API ===
SHOPIFY_STORE_DOMAIN="yoruapparel.com"\
SHOPIFY_API_TOKEN=REDACTED

# API ROUTES
### admin.js
- **Contains middleware to only allow support roles**
- Get: all tickets
- Get: all users
- Patch: user permissions

### notification.js
- Get: all unread messages of current user
- Post: Mark all as read

### order.js
- Get: all orders
- Get: specific order

### reply.js
- Post: add reply
- Get: all replies

### ticket.js
- Post: Create new ticket
- Get: All tickets
    - support: all user tickets
    - user: all of the user's tickets
- Get: Ticket by ID
- Patch: Ticket status
- Delete: Ticket (support only)

### user.js
- Post: Register new user
- Post: Login
- Post: Logout
- Get: Logged in user's info
