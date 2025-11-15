const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

const cupcakesRouter = require('./src/routes/cupcakes');
const authRouter = require('./src/routes/auth');
const cartRouter = require('./src/routes/cart');
const ordersRouter = require('./src/routes/orders');
const adminRouter = require('./src/routes/admin');

app.use('/api/cupcakes', cupcakesRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req,res)=> res.json({ok:true, message:'Cupcake API running'}));

app.listen(port, ()=> console.log(`Server listening on ${port}`));
// Serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
