const { json } = require('express');
//Importation d'express
const express = require('express');
//Importation de mongoose pour communiquer avec la base de données MongoDB
const mongoose = require('mongoose');
// Importation d'helmet 
const helmet = require("helmet");

// Variables d'environnement
require('dotenv').config();
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const sauceRoutes = require('./routes/sauce');
// Importation du model de sauce
const Sauce = require('./models/sauce');
// Importation du router
const userRoutes = require('./routes/user');
const path = require('path');

//création de l'application et appel de la méthode express
const app = express();
//  prend toutes les requêtes qui ont comme Content-Type  application/json  
//et met à disposition leur  body  directement sur l'objet req
// accès à req.body
app.use(express.json());
// Définit l’en-tête Content-Security-Policy pour la protection contre les attaques de type cross-site scripting et autres injections intersites.
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

//Connection au cluster MongoDB
mongoose.connect('mongodb+srv://'+dbUser+':'+dbPassword+'@cluster0.abn4yrw.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS, ajout des headers à l'objet réponse, s'applique à toutes les routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Toutes les origines sont autorisées
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, X-Auth-Token, Content-Type, Authorization'); // Headers autorisés
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Requêtes autorisées
  next();
});

// Spécification des routers utilisés pour chaque route
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// Exportation de l'application express pour y accéder depuis les autres fichiers
module.exports = app;