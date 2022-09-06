const bcrypt = require('bcrypt'); // Importation du package de cryptage
const User = require('../models/User'); // Importation du model
const jwt = require('jsonwebtoken'); // Importation de jsonwebtoken qui créé les tokens et les vérifis 

// Création de nouveaux users dans la bdd à partir de l'inscription depuis l'application front-end
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // fonction asynchrone, on "sale" 10 fois    
      .then(hash => { // On récupère le hash dans la promise
        const user = new User({ // On créé le nouveau user
          email: req.body.email,
          password: hash
        });
        user.save() // Enregistrement dans la bdd
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

// Connexion  
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // Méthode findOne de la class user avec filtre e-mail
      .then(user => { // On récupère le user dans la promise
        // Si utilisateur non trouvé
          if (!user) { 
              return res.status(401).json({ error: 'Paire identifiant/mot de passe incorrecte !' });
          }
        // Si utilisateur trouvé  
          bcrypt.compare(req.body.password, user.password) // Compare mdp saisi avec celui de la bdd
              .then(valid => {
                // Si mdp incorrect
                  if (!valid) { 
                      return res.status(401).json({ error: 'Paire identifiant/mot de passe incorrecte !' });
                  }
                // Si mdp correct
                  res.status(200).json({ 
                      userId: user._id, // On retourne objet avec infos necessaires à l'authentification des requêtes émises par la suite
                      token: jwt.sign( // Appel de la fonction sign
                          { userId: user._id }, // Payload : données que l'on veut encoder à l'intérieur du token pour identifier chaque requête
                          'RANDOM_TOKEN_SECRET', // Clé d'encodage qui sera plus complexe en prod
                          { expiresIn: '24h' } // Expiration au bout de 24h
                      )
                  });
              })
              .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
 };