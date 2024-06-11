const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

const login = (req, res) => {
  const { email, password } = req.body;
  const user = { id: 1, email: 'User@example.com' }; // Placeholder for user authentication

  console.log("received request from frontend");

  if (email === user.email && password === 'Password') {
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

module.exports = { login };
