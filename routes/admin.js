const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

// Connexion à la base de données
const db = new Database(path.join(__dirname, '..', 'db', 'porte-simulator.db'));

// Route pour récupérer toutes les portes (admin)
router.get('/doors', (req, res) => {
  try {
    const doors = db.prepare('SELECT * FROM doors ORDER BY id DESC').all();
    res.json(doors);
  } catch (error) {
    console.error('Erreur lors de la récupération des portes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour ajouter une nouvelle porte
router.post('/doors', (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'L\'image de la porte est requise' });
    }
    
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Le nom de la porte est requis' });
    }
    
    const doorImage = req.files.image;
    const fileName = Date.now() + '-' + doorImage.name;
    const uploadPath = path.join(__dirname, '..', 'uploads', 'doors', fileName);
    
    doorImage.mv(uploadPath, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const imagePath = `/uploads/doors/${fileName}`;
      
      const stmt = db.prepare('INSERT INTO doors (name, image_path, description) VALUES (?, ?, ?)');
      const info = stmt.run(name, imagePath, description || null);
      
      res.json({
        success: true,
        door_id: info.lastInsertRowid,
        door: {
          id: info.lastInsertRowid,
          name,
          image_path: imagePath,
          description: description || null
        }
      });
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la porte:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour supprimer une porte
router.delete('/doors/:id', (req, res) => {
  try {
    const doorId = req.params.id;
    
    // Vérifier si la porte existe
    const door = db.prepare('SELECT * FROM doors WHERE id = ?').get(doorId);
    
    if (!door) {
      return res.status(404).json({ error: 'Porte non trouvée' });
    }
    
    // Vérifier si la porte est utilisée dans des projets
    const usedInProjects = db.prepare('SELECT COUNT(*) as count FROM saved_projects WHERE door_id = ?').get(doorId);
    
    if (usedInProjects.count > 0) {
      return res.status(400).json({ 
        error: 'Cette porte est utilisée dans des projets existants et ne peut pas être supprimée' 
      });
    }
    
    // Supprimer l'image du système de fichiers si elle existe
    if (door.image_path && door.image_path.startsWith('/uploads/doors/')) {
      const imagePath = path.join(__dirname, '..', 'public', door.image_path);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Supprimer la porte de la base de données
    db.prepare('DELETE FROM doors WHERE id = ?').run(doorId);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de la porte:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour gérer les couleurs
router.get('/colors', (req, res) => {
  try {
    const colors = db.prepare('SELECT * FROM door_colors ORDER BY id').all();
    res.json(colors);
  } catch (error) {
    console.error('Erreur lors de la récupération des couleurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/colors', (req, res) => {
  try {
    const { name, hex_code } = req.body;
    
    if (!name || !hex_code) {
      return res.status(400).json({ error: 'Nom et code hexadécimal requis' });
    }
    
    const stmt = db.prepare('INSERT INTO door_colors (name, hex_code) VALUES (?, ?)');
    const info = stmt.run(name, hex_code);
    
    res.json({
      success: true,
      color_id: info.lastInsertRowid,
      color: {
        id: info.lastInsertRowid,
        name,
        hex_code,
        is_available: 1
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la couleur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Définir la disponibilité d'une couleur
router.put('/colors/:id/availability', (req, res) => {
  try {
    const colorId = req.params.id;
    const { is_available } = req.body;
    
    if (typeof is_available !== 'boolean') {
      return res.status(400).json({ error: 'Valeur de disponibilité invalide' });
    }
    
    const stmt = db.prepare('UPDATE door_colors SET is_available = ? WHERE id = ?');
    stmt.run(is_available ? 1 : 0, colorId);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la disponibilité:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes similaires pour les poignées et motifs
router.post('/handles', (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'L\'image de la poignée est requise' });
    }
    
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Le nom de la poignée est requis' });
    }
    
    const handleImage = req.files.image;
    const fileName = Date.now() + '-' + handleImage.name;
    const uploadPath = path.join(__dirname, '..', 'uploads', 'handles', fileName);
    
    handleImage.mv(uploadPath, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const imagePath = `/uploads/handles/${fileName}`;
      
      const stmt = db.prepare('INSERT INTO handles (name, image_path) VALUES (?, ?)');
      const info = stmt.run(name, imagePath);
      
      res.json({
        success: true,
        handle_id: info.lastInsertRowid,
        handle: {
          id: info.lastInsertRowid,
          name,
          image_path: imagePath,
          is_available: 1
        }
      });
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la poignée:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/patterns', (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'L\'image du motif est requise' });
    }
    
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Le nom du motif est requis' });
    }
    
    const patternImage = req.files.image;
    const fileName = Date.now() + '-' + patternImage.name;
    const uploadPath = path.join(__dirname, '..', 'uploads', 'patterns', fileName);
    
    patternImage.mv(uploadPath, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const imagePath = `/uploads/patterns/${fileName}`;
      
      const stmt = db.prepare('INSERT INTO patterns (name, image_path) VALUES (?, ?)');
      const info = stmt.run(name, imagePath);
      
      res.json({
        success: true,
        pattern_id: info.lastInsertRowid,
        pattern: {
          id: info.lastInsertRowid,
          name,
          image_path: imagePath,
          is_available: 1
        }
      });
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du motif:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;