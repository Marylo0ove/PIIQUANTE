// Un fichier de contrôleur exporte des méthodes qui sont ensuite attribuées aux routes 
// pour améliorer la maintenabilité de votre application.

const Sauce = require('../models/sauce');// Importation du model mongoose
const fs = require('fs');// Importation de package fs file system

// Création d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); // Converti la réponse de string à JSON
  delete sauceObject._userId; // Supprime userId pour le récup depuis le token -> plus sécurisé
  const sauce = new Sauce({ 
      ...sauceObject, // spread copie les champs du body de la requête
      userId: req.auth.userId, // UserId récupéré depuis le token
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Génération de l'url de l'image
  });
  
  sauce.save()// Méthode save enregistre dans la base de donnée, renvoie une promise
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})}) // réponse si ok sinon expiration de la requête
  .catch(error => { res.status(400).json( { error })})
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? { // On regarde s'il y a un champs file
      ...JSON.parse(req.body.sauce), // Si c'est le cas on recupère l'objet en parsant la chaine de caractère
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Et on recréé l'url de l'image
  } : { ...req.body }; // Sinon on recupère direct l'objet dans le corps de la requête
  //L'utilisation du mot-clé new avec un modèle Mongoose crée par défaut un champ_id . 
  //Utiliser ce mot-clé générerait une erreur, car nous tenterions de modifier un champ immuable dans un document de la base de données. 
  //Par conséquent, nous devons utiliser le paramètre id de la requête pour configurer notre Thing avec le même _id qu'avant.
  delete sauceObject._userId; // Pour éviter qu'un objet soit réattribué à quelqu'un d'autre
  Sauce.findOne({_id: req.params.id}) // Recherche dans la bdd pour s'assurer que c'est le créateur qui modifie
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) { // Utilisateurs différents -> non autorisé
              res.status(401).json({ message : 'Not authorized'});
          } else { // Même utilisateur = OK
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id}) // MAJ avec même id de l'URL
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error : error });
      });
};

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id}) // Recherche dans la bdd
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) { // Utilisateurs différents -> non autorisé
              res.status(401).json({message: 'Not authorized'});
          } else { // Même utilisateur = OK
              const filename = sauce.imageUrl.split('/images/')[1]; // Récup du nom de fichier qui est juste après '/images/'
              fs.unlink(`images/${filename}`, () => { // Méthode unlink de fs qui supprime le fichier image
                  Sauce.deleteOne({_id: req.params.id}) // Suppresion dans la bdd en filtrant par id
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

// Affichage d'une sauce
exports.getOneSauce = (req, res, next) => {
 Sauce.findOne({_id: req.params.id}) // objet de comparaison, l'id de ce qu'on cherche doit être égal au paramètre de requête
 .then((sauce) => {
     res.status(200).json(sauce);
   })
 .catch(
     (error) => {res.status(404).json({error: error});
 });
}

// Affichage de toutes les sauces
exports.getAllSauces = (req, res, next) => {
 Sauce.find()
 .then((sauces) => {
     res.status(200).json(sauces);
   })
 .catch(
     (error) => {res.status(400).json({error: error});}
 );
}

// Like / Dislike
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({_id : req.params.id}) // Récup id de la sauce dans URL de la requête
  .then((sauce) => {
switch(req.body.like){
  case 1 : // L'utilisateur n'a pas déjà liké
        if(!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1){
          Sauce.updateOne({_id: req.params.id},
          {
            $inc: {likes: 1}, // Ajout du like
            $push: {usersLiked: req.body.userId} // Ajout du userId dans usersLiked
          }
          )
          .then(() => res.status(201).json({message: "Sauce like +1"}))
          .catch(error => { res.status(400).json( { error })});
        }
        break;
  case 0 : // L'utilisateur a déjà liké / disliké
        if(sauce.usersLiked.includes(req.body.userId)){
          Sauce.updateOne({_id: req.params.id},
          {
            $inc: {likes: -1}, // Suppression du like
            $pull: {usersLiked: req.body.userId} // Suppression du userId dans usersLiked
          }
          )
          .then(() => res.status(201).json({message: "Sauce like 0"}))
          .catch(error => { res.status(400).json( { error })});
        }
        if(sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0){
          Sauce.updateOne({_id: req.params.id},
          {
            $inc: {dislikes: -1},
            $pull: {usersDisliked: req.body.userId}
          }
          )
          .then(() => res.status(201).json({message: "Sauce dislike 0"}))
          .catch(error => { res.status(400).json( { error })});
        }
        break;
        case -1 : // L'utilisateur n'a pas déjà disliké
        if(!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1){
          Sauce.updateOne({_id: req.params.id},
          {
            $inc: {dislikes: 1}, // Ajout du dislike
            $push: {usersDisliked: req.body.userId} // Ajout du userId dans usersDisliked
          }
          )
          .then(() => res.status(201).json({message: "Sauce dislike +1"}))
          .catch(error => { res.status(400).json( { error })});
        }
        break;
        
      }   
    })
    .catch(error => { res.status(400).json( { error })});

}