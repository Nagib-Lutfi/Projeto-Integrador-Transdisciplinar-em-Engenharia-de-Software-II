const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, '..', 'data', 'database.sqlite');
const ensureDir = () => {
  const dir = path.dirname(dbFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
ensureDir();
const db = new Database(dbFile);

// create tables
db.exec(`
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  phone TEXT,
  address TEXT,
  isAdmin INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cupcakes (
  id TEXT PRIMARY KEY,
  name TEXT,
  description TEXT,
  price REAL,
  flavor TEXT,
  image TEXT,
  stock INTEGER
);

CREATE TABLE IF NOT EXISTS cart_items (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  cupcake_id TEXT,
  quantity INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(cupcake_id) REFERENCES cupcakes(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  total REAL,
  shipping_address TEXT,
  shipping_method TEXT,
  status TEXT,
  created_at TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT,
  cupcake_id TEXT,
  quantity INTEGER,
  price REAL,
  FOREIGN KEY(order_id) REFERENCES orders(id),
  FOREIGN KEY(cupcake_id) REFERENCES cupcakes(id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  cupcake_id TEXT,
  rating INTEGER,
  comment TEXT,
  approved INTEGER DEFAULT 0,
  created_at TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(cupcake_id) REFERENCES cupcakes(id)
);
`);

// seeding helper
if (process.argv.includes('--seed')) {
  const { v4: uuid } = require('uuid');
  const bcrypt = require('bcrypt');

  const insertCupcake = db.prepare(`INSERT OR REPLACE INTO cupcakes (id,name,description,price,flavor,image,stock) VALUES (?,?,?,?,?,?,?)`);
  const cupcakes = [
    ['Chocolate Dream','Delicious chocolate cupcake','6.50','chocolate','/images/choc.jpg', 20],
    ['Vanilla Sky','Classic vanilla with buttercream','5.50','vanilla','/images/vanilla.jpg', 15],
    ['Strawberry Bliss','Strawberry filling and glaze','6.00','strawberry','/images/straw.jpg', 10],
    ['Lemon Zest','Fresh lemon flavor','5.75','lemon','/images/lemon.jpg', 0]
  ];
  cupcakes.forEach(c=>{
    insertCupcake.run(uuid(), c[0], c[1], parseFloat(c[2]), c[3], c[4], c[5]);
  });

  const insertAdmin = db.prepare('INSERT OR IGNORE INTO users (id,name,email,password,phone,address,isAdmin) VALUES (?,?,?,?,?,?,?)');
  const pwdHash = bcrypt.hashSync('admin123', 10);
  insertAdmin.run(uuid(), 'Admin', 'admin@cupcake.com', pwdHash, '000000000', 'Loja Cupcake', 1);

  console.log('Seed completed');
  process.exit(0);
}

module.exports = db;
