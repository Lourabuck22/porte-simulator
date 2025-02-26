const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

function initDatabase() {
  // Créer le dossier de base de données s'il n'existe pas
  const dbDir = path.join(__dirname);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Chemin vers la base de données
  const dbPath = path.join(dbDir, 'porte-simulator.db');
  
  // Création/connexion à la base de données
  const db = new Database(dbPath);

  // Activation des clés étrangères
  db.pragma('foreign_keys = ON');

  // Création des tables
  db.exec(`
    -- Table des portes
    CREATE TABLE IF NOT EXISTS doors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image_path TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Table des couleurs disponibles pour les portes
    CREATE TABLE IF NOT EXISTS door_colors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      hex_code TEXT NOT NULL,
      is_available BOOLEAN DEFAULT 1
    );

    -- Table des poignées
    CREATE TABLE IF NOT EXISTS handles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image_path TEXT NOT NULL,
      is_available BOOLEAN DEFAULT 1
    );

    -- Table des motifs/vitrages
    CREATE TABLE IF NOT EXISTS patterns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image_path TEXT NOT NULL,
      is_available BOOLEAN DEFAULT 1
    );

    -- Table des projets sauvegardés
    CREATE TABLE IF NOT EXISTS saved_projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_name TEXT NOT NULL,
      facade_path TEXT NOT NULL,
      door_id INTEGER,
      door_color_id INTEGER,
      handle_id INTEGER,
      pattern_id INTEGER,
      custom_settings TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (door_id) REFERENCES doors(id),
      FOREIGN KEY (door_color_id) REFERENCES door_colors(id),
      FOREIGN KEY (handle_id) REFERENCES handles(id),
      FOREIGN KEY (pattern_id) REFERENCES patterns(id)
    );
  `);

  // Insertion des données de démo si tables vides
  const doorCount = db.prepare('SELECT COUNT(*) as count FROM doors').get();
  
  if (doorCount.count === 0) {
    // Insertion de quelques portes par défaut
    const insertDoor = db.prepare('INSERT INTO doors (name, image_path, description) VALUES (?, ?, ?)');
    insertDoor.run('Porte Moderne', '/uploads/doors/default-door-1.png', 'Porte au style contemporain');
    insertDoor.run('Porte Classique', '/uploads/doors/default-door-2.png', 'Porte de style traditionnel');
    
    // Insertion de couleurs par défaut
    const insertColor = db.prepare('INSERT INTO door_colors (name, hex_code) VALUES (?, ?)');
    insertColor.run('Blanc', '#FFFFFF');
    insertColor.run('Noir', '#000000');
    insertColor.run('Rouge', '#FF0000');
    insertColor.run('Bleu', '#0000FF');
    insertColor.run('Vert', '#00FF00');
    insertColor.run('Bois naturel', '#A0522D');
    
    // Insertion de poignées par défaut
    const insertHandle = db.prepare('INSERT INTO handles (name, image_path) VALUES (?, ?)');
    insertHandle.run('Poignée standard', '/uploads/handles/handle-standard.png');
    insertHandle.run('Poignée moderne', '/uploads/handles/handle-modern.png');
    
    // Insertion de motifs par défaut
    const insertPattern = db.prepare('INSERT INTO patterns (name, image_path) VALUES (?, ?)');
    insertPattern.run('Sans motif', '/uploads/patterns/none.png');
    insertPattern.run('Vitrage carré', '/uploads/patterns/square-glass.png');
  }

  console.log('Base de données initialisée avec succès');
  
  // Création des dossiers pour les uploads
  const uploadFolders = [
    path.join(__dirname, '..', 'uploads'),
    path.join(__dirname, '..', 'uploads', 'doors'),
    path.join(__dirname, '..', 'uploads', 'facades'),
    path.join(__dirname, '..', 'uploads', 'handles'),
    path.join(__dirname, '..', 'uploads', 'patterns')
  ];
  
  uploadFolders.forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  });

  // Fermeture de la connexion
  db.close();
}

module.exports = initDatabase;