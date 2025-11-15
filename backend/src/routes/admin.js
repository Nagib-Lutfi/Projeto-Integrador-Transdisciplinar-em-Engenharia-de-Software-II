const express = require('express');
const db = require('../db');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safe = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    cb(null, `${timestamp}-${safe}`);
  },
});
const upload = multer({ storage });
const { v4: uuid } = require('uuid');
const router = express.Router();

router.get('/cupcakes', (req, res) => {
  const cupcakes = db.prepare('SELECT * FROM cupcakes').all();
  res.json(cupcakes);
});

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  const publicBase = process.env.PUBLIC_URL || 'http://localhost:4000';
  res.json({ url, absoluteUrl: `${publicBase}${url}` });
});

// Admin can create cupcakes
router.post('/cupcakes', (req, res) => {
  const { name, description, price, flavor, image, stock } = req.body;
  const id = uuid();
  
  db.prepare('INSERT INTO cupcakes (id, name, description, price, flavor, image, stock) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, name, description, price, flavor, image, stock);
  
  res.status(201).json({ id, name, description, price });
});

// Edit cupcake
router.put('/cupcakes/:id', (req, res) => {
  const id = req.params.id;
  const { name, description, price, flavor, image, stock } = req.body;
  db.prepare('UPDATE cupcakes SET name = ?, description = ?, price = ?, flavor = ?, image = ?, stock = ? WHERE id = ?')
    .run(name, description, Number(price), flavor, image, Number(stock), id);
  const updated = db.prepare('SELECT * FROM cupcakes WHERE id = ?').get(id);
  res.json(updated);
});

// Update stock
router.post('/stock/:id', (req, res) => {
  const { stock } = req.body;
  const cupcakeId = req.params.id;
  
  db.prepare('UPDATE cupcakes SET stock = ? WHERE id = ?').run(stock, cupcakeId);
  
  res.json({ message: 'Stock updated' });
});

// Delete cupcake (prevent delete if has order items)
router.delete('/cupcakes/:id', (req, res) => {
  const id = req.params.id;
  try {
    db.prepare('DELETE FROM cart_items WHERE cupcake_id = ?').run(id);
    const hasOrders = db.prepare('SELECT COUNT(1) AS cnt FROM order_items WHERE cupcake_id = ?').get(id);
    if (hasOrders && hasOrders.cnt > 0) {
      return res.status(400).json({ error: 'Cannot delete: cupcake has order history' });
    }
    db.prepare('DELETE FROM cupcakes WHERE id = ?').run(id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
