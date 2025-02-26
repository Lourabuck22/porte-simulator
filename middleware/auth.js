/**
 * Middleware d'authentification basique pour protéger l'interface d'administration
 * Configuration par défaut : 
 * - Nom d'utilisateur : admin
 * - Mot de passe : porte123
 * 
 * Pour plus de sécurité, ces informations devraient être stockées dans des variables 
 * d'environnement ou dans une base de données avec cryptage.
 */

function basicAuth(req, res, next) {
  // Vérifier si l'en-tête Authorization est présent
  const auth = req.headers.authorization;
  
  if (!auth) {
    // Aucune autorisation fournie, demander l'authentification
    res.setHeader('WWW-Authenticate', 'Basic realm="Administration du Simulateur de Portes"');
    return res.status(401).send('Authentification requise pour accéder à cette section');
  }
  
  // Décoder les identifiants (format: "Basic base64(username:password)")
  try {
    const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
    const username = credentials[0];
    const password = credentials[1];
    
    // Vérifier les identifiants (à remplacer par une vérification plus sécurisée en production)
    if (username === 'admin' && password === 'porte123') {
      // Authentification réussie
      return next();
    }
    
    // Identifiants incorrects
    res.setHeader('WWW-Authenticate', 'Basic realm="Administration du Simulateur de Portes"');
    return res.status(401).send('Identifiants invalides');
  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error);
    res.setHeader('WWW-Authenticate', 'Basic realm="Administration du Simulateur de Portes"');
    return res.status(401).send('Erreur d\'authentification');
  }
}

module.exports = basicAuth;