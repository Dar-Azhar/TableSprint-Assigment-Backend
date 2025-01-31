const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

const categoryRoutes = require("./routes/category.router");
const subcategoryRoutes = require("./routes/subCategory.router");
const productRoutes = require("./routes/product.router");
const authRoutes = require("./routes/auth.router");

dotenv.config();

const app = express();

const corsOptions = {
  origin: ['*', 'http://localhost:3000', 'https://tablesprint-assigment-frontend.onrender.com/',  'https://tablesprint22.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => res.send("Welcome to the tableSprint API"));


app.use('/api/category', categoryRoutes);
app.use('/api/sub-category', subcategoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});