const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const { v4: uuid } = require('uuid');
const router = express.Router();

// Register new user
router.post('/register', (req, res) => {
  const { name, email, password, phone, address } = req.body;
  const passwordHash = bcrypt.hashSync(password, 10);
  const id = uuid();
  db.prepare('INSERT INTO users (id,name,email,password,phone,address) VALUES (?,?,?,?,?,?)')
    .run(id, name, email, passwordHash, phone, address);
  res.status(201).json({ id, name, email });
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  res.json({ id: user.id, name: user.name, email: user.email, isAdmin: !!user.isAdmin });
});

module.exports = router;
