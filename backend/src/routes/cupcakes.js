const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  const cupcakes = db.prepare('SELECT * FROM cupcakes WHERE stock > 0').all();
  res.json(cupcakes);
});

router.get('/:id', (req, res) => {
  const cupcake = db.prepare('SELECT * FROM cupcakes WHERE id = ?').get(req.params.id);
  res.json(cupcake);
});

module.exports = router;
