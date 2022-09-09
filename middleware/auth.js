const jwt = require('jsonwebtoken'); // Importation de jsonwebtoken qui créé les tokens et les vérifis 
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; // enlève le mot clé "bearer" et l'espace avant le token
       const decodedToken = jwt.verify(token, process.env.CLE_TOKEN); // décode le token avec la clé de chiffrement
       const userId = decodedToken.userId; // recup userId dans le token décodé
       if (req.body.userId && req.body.userId != userId){ // Verif si userId du token et userId de la requête correspondent
        throw 'User ID invalide !';
    } else {
        req.auth = { // Rajoute userId à la requête pour que les routes puissent l'exploiter
           userId: userId
       };
        next();
    }
   } catch(error) {
       res.status(401).json({ error });
   }
};

