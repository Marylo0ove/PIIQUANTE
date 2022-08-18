const { json } = require('express');
const express = require('express');
const mongoose = require('mongoose');

const sauceRoutes = require('./routes/sauce');
const Sauce = require('./models/sauce');
const userRoutes = require('./routes/user');
const path = require('path');

const app = express();
app.use(express.json());


mongoose.connect('mongodb+srv://marylo0ove:pPSuShhqjLxOAfY7@cluster0.abn4yrw.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, X-Auth-Token, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;