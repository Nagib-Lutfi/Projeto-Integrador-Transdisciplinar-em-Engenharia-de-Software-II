const express = require('express');
const db = require('../db');
const { v4: uuid } = require('uuid');
const router = express.Router();

router.get('/:userId', (req, res) => {
  const cartItems = db
    .prepare(
      `SELECT ci.id, ci.quantity, ci.cupcake_id AS cupcakeId, c.name, c.price, c.image
       FROM cart_items ci
       JOIN cupcakes c ON c.id = ci.cupcake_id
       WHERE ci.user_id = ?`
    )
    .all(req.params.userId);
  res.json(cartItems);
});

router.post('/:userId/add', (req, res) => {
  const { cupcakeId, quantity } = req.body;
  const userId = req.params.userId;
  const cupcake = db.prepare('SELECT * FROM cupcakes WHERE id = ?').get(cupcakeId);
  
  if (cupcake && cupcake.stock >= quantity) {
    db.prepare('INSERT INTO cart_items (id, user_id, cupcake_id, quantity) VALUES (?, ?, ?, ?)').run(uuid(), userId, cupcakeId, quantity);
    res.status(201).json({ message: 'Item added to cart' });
  } else {
    res.status(400).json({ error: 'Not enough stock' });
  }
});

router.post('/:userId/remove', (req, res) => {
  const { id } = req.body;
  db.prepare('DELETE FROM cart_items WHERE id = ?').run(id);
  res.json({ message: 'Item removed from cart' });
});

module.exports = router;
