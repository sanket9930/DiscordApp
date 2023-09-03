// middleware/auth.js
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    console.log(token);
    const decoded = jwt.verify(token, process.env.SECRET); 
    req.user = decoded;
    
    next();
  } catch (ex) {
    res.status(400).json({ message: ex });
  }
}

module.exports = verifyToken;
