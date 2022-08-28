// Un fichier de contrôleur exporte des méthodes qui sont ensuite attribuées aux routes 
// pour améliorer la maintenabilité de votre application.

//Importation du model mongoose
const Sauce = require('../models/sauce');
// Package fs file system
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  //delete sauceObject._id; POURQUOI ???
  delete sauceObject._userId;
  // Création d'une instance du model en lui passant un objet JavaScript contenant toutes les informations requises du corps de requête analysé
  const sauce = new Sauce({
      ...sauceObject, // spread copie les champs du body de la requête
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  //méthode save enregistre dans la base de donnée, renvoie une promise
  sauce.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})}) // réponse si ok sinon expiration de la requête
  .catch(error => { res.status(400).json( { error })})
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? { // On regarde s'il y a un champs file
      ...JSON.parse(req.body.sauce), // Si c'est le cas on recupère l'objet en parsant la chaine de caractère
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Et on recréé l'url de l'image
  } : { ...req.body }; // Sinon on recupère direct l'objet dans le corps de la requête
  //L'utilisation du mot-clé new avec un modèle Mongoose crée par défaut un champ_id . 
  //Utiliser ce mot-clé générerait une erreur, car nous tenterions de modifier un champ immuable dans un document de la base de données. 
  //Par conséquent, nous devons utiliser le paramètre id de la requête pour configurer notre Thing avec le même _id qu'avant.

  delete sauceObject._userId; // Pour éviter qu'un objet soit réattribué à quelqu'un d'autre
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => { // méthode unlink de fs
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

  exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) // objet de comparaison, l'id de ce qu'on cherche doit être égal au paramètre de requête
    .then((sauce) => {
        res.status(200).json(sauce);
      })
    .catch(
        (error) => {res.status(404).json({error: error});
    });
  }

  exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((sauces) => {
        res.status(200).json(sauces);
      })
    .catch(
        (error) => {res.status(400).json({error: error});}
    );
  }

  exports.likeSauce = (req, res, next) => {
    Sauce.findOne({_id : req.params.id})
    .then((sauce) => {

switch(req.body.like){
  case 1 : 
        if(!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1){
          Sauce.updateOne({_id: req.params.id},
          {
            $inc: {likes: 1},
            $push: {usersLiked: req.body.userId}
          }
          )
          .then(() => res.status(201).json({message: "Sauce like +1"}))
          .catch(error => { res.status(400).json( { error })});
        }
        break;
  case 0 :
        if(sauce.usersLiked.includes(req.body.userId)){
          Sauce.updateOne({_id: req.params.id},
          {
            $inc: {likes: -1},
            $pull: {usersLiked: req.body.userId}
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
        case -1 : 
        if(!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1){
          Sauce.updateOne({_id: req.params.id},
          {
            $inc: {dislikes: 1},
            $push: {usersDisliked: req.body.userId}
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