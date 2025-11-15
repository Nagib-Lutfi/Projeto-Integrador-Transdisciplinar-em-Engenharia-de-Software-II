const express = require('express');
const db = require('../db');
const { v4: uuid } = require('uuid');
const router = express.Router();

// Checkout and create an order
router.post('/:userId/checkout', (req, res) => {
  const { total, shipping_address, shipping_method } = req.body;
  const userId = req.params.userId;
  
  const orderId = uuid();
  const status = 'In preparation';
  const createdAt = new Date().toISOString();
  
  db.prepare('INSERT INTO orders (id, user_id, total, shipping_address, shipping_method, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run(orderId, userId, total, shipping_address, shipping_method, status, createdAt);
  
  res.status(201).json({ orderId, status });
});

router.get('/:userId', (req, res) => {
  const orders = db
    .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.params.userId);
  res.json(orders);
});

module.exports = router;
