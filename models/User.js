const mongoose = require('mongoose'); // Importation de mongoose pour communiquer avec la base de données MongoDB
const mongodbErrorHandler = require('mongoose-mongodb-errors'); // Importation du package de gestion des messages d'erreur MongoDB

// Package validateur prévalide les infos avant de les envoyer
// Prévient les erreurs générées par défaut par mongoDB
// en améliorant les messages d'erreur lors de l'enregistrement de données uniques
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Méthode plugin avec uniqueValidator comme argument
userSchema.plugin(uniqueValidator);
// Méthode plugin avec mongodbErrorHandler comme argument
userSchema.plugin(mongodbErrorHandler);

// Exportation du model que l'on nomme user avec userShema comme schema de données
module.exports = mongoose.model('User', userSchema);