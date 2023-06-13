// Dependencies
const express = require('express');
const mongoose = require("mongoose")
const Product = require('./models/products')
const methodOverride = require("method-override");
const { findOneAndUpdate } = require('./models/products');
const app = express();
require('dotenv').config();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
mongoose.connect(process.env.DATABASE_URL)

// Database Connection Error/Success
// Define callback functions for various events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// Middleware
// Body parser middleware: give us access to req.body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))



// INDUCES

// Index
app.get('/products', async (req, res) => {
    const allProducts = await Product.find({}).exec();
    res.render('index.ejs', {
      products: allProducts,
    });
  });

// New
// Render the "new" view
app.get('/products/new', (req, res) => {
    res.render('new.ejs', { product: {} });
  });
  
// C is for CREATE
app.post('/products', (req,res) => {
  const createdProduct = new Product(req.body)
  createdProduct.save().then(res.redirect('/products'))
})

//Seed Data
app.get('products/seed', async (req, res) => {
  const products = [
    {
      name: 'Beans',
      description: 'A small pile of beans. Buy more beans for a big pile of beans.',
      img: 'https://imgur.com/LEHS8h3.png',
      price: 5,
      qty: 99
    },
    {
      name: 'Bones',
      description: 'It\'s just a bag of bones.',
      img: 'https://imgur.com/dalOqwk.png',
      price: 25,
      qty: 0
    },
    {
      name: 'Bins',
      description: 'A stack of colorful bins for your beans and bones.',
      img: 'https://imgur.com/ptWDPO1.png',
      price: 7000,
      qty: 1
    }
  ];
  await Product.insertMany(products);
  res.send('Seeded');
});

// Delete
app.delete('/products/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
  });


//Buy Button
app.post('/products/:id/buy', async (req, res) => {
    
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).send('Product not found');
      }
      if (product.qty === 0) {
        return res.send('Product is out of stock');
      }
      product.qty--;
      await product.save();
      res.redirect(`/products/${product._id}`);
    });


// Update
app.put('/products/:id', async (req, res) => {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.redirect(`/products/${updatedProduct._id}`);
  });

// Edit
app.get('/products/:id/edit', async (req, res) => {
    const foundProduct = await Product.findById(req.params.id).exec();
    if (!foundProduct) {
      res.send('Product not found');
      return;
    }
    res.render('edit.ejs', { product: foundProduct });
  });

// Show
app.get('/products/:id', async (req, res) => {
    const foundProduct = await Product.findById(req.params.id).exec();
    if (!foundProduct) {
      res.send('Product not found');
      return;
    }
    res.render('show.ejs', {
      product: foundProduct,
    });
  });

// Listener
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is listening on port: ${PORT}`));