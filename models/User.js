const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // package validateur prévalide les infos avant de les envoyer
// Prévient les erreurs générées par défaut par mongoDB
// Elément passé en plugin
// améliore les messages d'erreur lors de l'enregistrement de données uniques.

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Méthode plugin avec uniqueValidator comme argument
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);