const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // créé les tokens et les vérifis  

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // fonction asynchrone, on "sale" 10 fois    
      .then(hash => { // On récupère le hash
        const user = new User({ // On créé le nouveau user
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            // Utilisateur non trouvé
            if (!user) {
                return res.status(401).json({ error: 'Paire identifiant/mot de passe incorrecte !' });
            }
            // Utilisateur trouvé
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) { // mdp incorrect
                        return res.status(401).json({ error: 'Paire identifiant/mot de passe incorrecte !' });
                    }
                    res.status(200).json({ // mdp correct
                        userId: user._id, // objet avec info necessaire à l'authentification des requêtes émises par la suite
                        token: jwt.sign(
                            { userId: user._id }, // pour identifier chaque requête
                            'RANDOM_TOKEN_SECRET', // sera plus complexe en prod
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };