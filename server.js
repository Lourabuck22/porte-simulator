const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');

// Middleware d'authentification
const basicAuth = require('./middleware/auth');

// Routes
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

// Initialisation de la base de données
const dbInit = require('./db/init');
dbInit();

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour la sécurité
app.use(helmet({
  contentSecurityPolicy: false, // Désactivé pour la simplicité, à activer en production
}));

// Configuration des middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
}));

// Création des dossiers d'upload s'ils n'existent pas
const uploadDirs = ['./uploads', './uploads/facades', './uploads/doors'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Servir les fichiers statiques
app.use(express.static('public'));

// Définition des routes
app.use('/api', apiRoutes);

// Application du middleware d'authentification sur les routes d'admin
app.use('/admin', basicAuth, adminRoutes);
app.get('/admin', basicAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Route par défaut pour l'application (PWA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Application accessible à l'adresse: http://localhost:${PORT}`);
  console.log(`Interface d'administration: http://localhost:${PORT}/admin`);
  console.log(`Identifiants par défaut pour l'administration: admin / porte123`);
});