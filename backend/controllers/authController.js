
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // For demo purposes, we'll accept any password for demo users
    // In a real app, you would uncomment the below code to verify the password
    /*
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    */
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // Return user data and token
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        companyName: user.company_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Register user
exports.register = async (req, res) => {
  try {
    const { username, password, email, companyName } = req.body;
    
    // Check if user already exists
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE username = ? OR email = ?', 
      [username, email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username or email already in use' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user
    const [result] = await db.query(
      'INSERT INTO users (username, password, email, company_name, role) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, email, companyName, 'company']
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertId, username, role: 'company' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // Return user data and token
    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        username,
        companyName,
        email,
        role: 'company'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
