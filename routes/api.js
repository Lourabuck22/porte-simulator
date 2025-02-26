const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

// Connexion à la base de données
const db = new Database(path.join(__dirname, '..', 'db', 'porte-simulator.db'));

// Route pour obtenir toutes les portes
router.get('/doors', (req, res) => {
  try {
    const doors = db.prepare('SELECT * FROM doors').all();
    res.json(doors);
  } catch (error) {
    console.error('Erreur lors de la récupération des portes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir une porte spécifique
router.get('/doors/:id', (req, res) => {
  try {
    const door = db.prepare('SELECT * FROM doors WHERE id = ?').get(req.params.id);
    if (!door) {
      return res.status(404).json({ error: 'Porte non trouvée' });
    }
    res.json(door);
  } catch (error) {
    console.error('Erreur lors de la récupération de la porte:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir toutes les couleurs
router.get('/colors', (req, res) => {
  try {
    const colors = db.prepare('SELECT * FROM door_colors WHERE is_available = 1').all();
    res.json(colors);
  } catch (error) {
    console.error('Erreur lors de la récupération des couleurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir toutes les poignées
router.get('/handles', (req, res) => {
  try {
    const handles = db.prepare('SELECT * FROM handles WHERE is_available = 1').all();
    res.json(handles);
  } catch (error) {
    console.error('Erreur lors de la récupération des poignées:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir tous les motifs/vitrages
router.get('/patterns', (req, res) => {
  try {
    const patterns = db.prepare('SELECT * FROM patterns WHERE is_available = 1').all();
    res.json(patterns);
  } catch (error) {
    console.error('Erreur lors de la récupération des motifs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour uploader une image de façade
router.post('/upload/facade', (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'Aucun fichier n\'a été téléchargé' });
    }
    
    const facadeImage = req.files.facade;
    const fileName = Date.now() + '-' + facadeImage.name;
    const uploadPath = path.join(__dirname, '..', 'uploads', 'facades', fileName);
    
    facadeImage.mv(uploadPath, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({
        success: true,
        file_path: `/uploads/facades/${fileName}`
      });
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload de la façade:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour sauvegarder un projet
router.post('/projects/save', (req, res) => {
  try {
    const {
      project_name,
      facade_path,
      door_id,
      door_color_id,
      handle_id,
      pattern_id,
      custom_settings
    } = req.body;
    
    if (!project_name || !facade_path || !door_id) {
      return res.status(400).json({ error: 'Données incomplètes pour la sauvegarde' });
    }
    
    const stmt = db.prepare(`
      INSERT INTO saved_projects
      (project_name, facade_path, door_id, door_color_id, handle_id, pattern_id, custom_settings)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const info = stmt.run(
      project_name,
      facade_path,
      door_id,
      door_color_id || null,
      handle_id || null,
      pattern_id || null,
      custom_settings || null
    );
    
    res.json({
      success: true,
      project_id: info.lastInsertRowid
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du projet:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour récupérer les projets sauvegardés
router.get('/projects', (req, res) => {
  try {
    const projects = db.prepare(`
      SELECT sp.*, d.name as door_name, dc.name as color_name, h.name as handle_name, p.name as pattern_name
      FROM saved_projects sp
      LEFT JOIN doors d ON sp.door_id = d.id
      LEFT JOIN door_colors dc ON sp.door_color_id = dc.id
      LEFT JOIN handles h ON sp.handle_id = h.id
      LEFT JOIN patterns p ON sp.pattern_id = p.id
      ORDER BY sp.created_at DESC
    `).all();
    
    res.json(projects);
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;