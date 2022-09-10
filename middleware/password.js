// Importation de password-validator
const passwordValidator = require('password-validator');

// Création du shéma
const passwordSchema = new passwordValidator();

// Le schéma que doit respecter le mot de passe
passwordSchema
.is().min(8)                                    // Minimum 8 caractères
.is().max(100)                                  // Maximum 100 caractères
.has().uppercase()                              // Doit contenir des MAJUSCULES
.has().lowercase()                              // Doit contenir des minuscules
.has().digits(2)                                // Doit contenir 2 chiffres
.has().not().spaces()                           // Ne doit pas contenir d'espace

module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)){
        next();
    }else{
        return res.status(400).json({error : `Le mot de passe n'est pas assez fort: ${passwordSchema.validate('req.body.password', { list: true })}`})
    }
}