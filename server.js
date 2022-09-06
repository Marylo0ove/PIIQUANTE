// Importation du package 'http' natif de Node qui nous permet de créer le serveur
const http = require('http');
// Importation de l'application express
const app = require('./app');

// Renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// On dit à l'application express sur quel port elle doit tourner
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Recherche les différentes erreurs et les gère de manière appropriée.
// Elle est ensuite enregistrée dans le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Appel de la méthode createServer du package 'http'
// qui prend comme argument la fonction qui sera appelée à chaque requête reçue par le serveur
// cette fonction reçoit automatiquement 2 arguments, la requête et la réponse. Ici c'est app la fonction
const server = http.createServer(app);

// Consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Méthode listen du serveur, par défaut écoute du port 3000, si pas dispo : variable environnement
server.listen(process.env.PORT|| 3000);