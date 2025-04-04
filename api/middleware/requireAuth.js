const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const token = req.cookies.auth_token;
  console.log('Cookies', req.cookies);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

module.exports = requireAuth;
