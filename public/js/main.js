// Fichier principal de l'application
document.addEventListener('DOMContentLoaded', function() {
  // Variables globales
  const state = {
    facade: null,
    selectedDoor: null,
    selectedColor: null,
    selectedHandle: null,
    selectedPattern: null,
    doorPosition: {
      x: 50, // pourcentage de la largeur de la visualisation
      y: 75, // pourcentage de la hauteur de la visualisation
      scale: 1
    },
    savedProjects: []
  };

  // Éléments DOM
  const elements = {
    doorsGrid: document.getElementById('doors-grid'),
    visualization: document.getElementById('visualization'),
    doorPositioning: document.getElementById('door-positioning'),
    colorsContainer: document.getElementById('colors-container'),
    handlesContainer: document.getElementById('handles-container'),
    patternsContainer: document.getElementById('patterns-container'),
    colorsGroup: document.getElementById('colors-group'),
    handlesGroup: document.getElementById('handles-group'),
    patternsGroup: document.getElementById('patterns-group'),
    saveButton: document.getElementById('save-project'),
    exportButton: document.getElementById('export-image'),
    savedProjectsContainer: document.getElementById('saved-projects'),
    saveModal: document.getElementById('save-modal'),
    projectNameInput: document.getElementById('project-name'),
    confirmSaveButton: document.getElementById('confirm-save')
  };

  // Boutons de positionnement
  const positionButtons = {
    left: document.getElementById('position-left'),
    right: document.getElementById('position-right'),
    up: document.getElementById('position-up'),
    down: document.getElementById('position-down'),
    sizeIncrease: document.getElementById('size-increase'),
    sizeDecrease: document.getElementById('size-decrease')
  };

  // Chargement initial des données
  loadDoors();
  loadColors();
  loadHandles();
  loadPatterns();
  loadSavedProjects();

  // Event listeners pour positionnement de la porte
  setupPositionControls();

  // Event listeners pour les boutons d'action
  setupActionButtons();

  // Chargement des portes disponibles
  function loadDoors() {
    fetch('/api/doors')
      .then(response => response.json())
      .then(doors => {
        if (doors.length > 0) {
          displayDoors(doors);
        } else {
          elements.doorsGrid.innerHTML = '<p>Aucune porte disponible. Utilisez l\'interface d\'administration pour en ajouter.</p>';
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement des portes:', error);
        elements.doorsGrid.innerHTML = '<p>Erreur lors du chargement des portes. Veuillez réessayer plus tard.</p>';
      });
  }

  // Affichage des portes dans la grille
  function displayDoors(doors) {
    elements.doorsGrid.innerHTML = '';
    
    doors.forEach(door => {
      const doorElement = document.createElement('div');
      doorElement.className = 'door-item';
      doorElement.setAttribute('data-id', door.id);
      
      const doorImage = document.createElement('img');
      doorImage.src = door.image_path;
      doorImage.alt = door.name;
      
      const doorName = document.createElement('p');
      doorName.textContent = door.name;
      
      doorElement.appendChild(doorImage);
      doorElement.appendChild(doorName);
      
      // Event listener pour la sélection de porte
      doorElement.addEventListener('click', () => selectDoor(door));
      
      elements.doorsGrid.appendChild(doorElement);
    });
  }

  // Sélection d'une porte
  function selectDoor(door) {
    // Mise à jour de l'état
    state.selectedDoor = door;
    
    // Mise à jour de l'UI
    document.querySelectorAll('.door-item').forEach(item => {
      item.classList.remove('selected');
    });
    
    document.querySelector(`.door-item[data-id="${door.id}"]`).classList.add('selected');
    
    // Afficher la visualisation si une façade est chargée
    if (state.facade) {
      updateVisualization();
      elements.doorPositioning.style.display = 'block';
      elements.colorsGroup.style.display = 'block';
      elements.handlesGroup.style.display = 'block';
      elements.patternsGroup.style.display = 'block';
      elements.saveButton.disabled = false;
      elements.exportButton.disabled = false;
    }
  }

  // Chargement des couleurs
  function loadColors() {
    fetch('/api/colors')
      .then(response => response.json())
      .then(colors => {
        if (colors.length > 0) {
          displayColors(colors);
        } else {
          elements.colorsContainer.innerHTML = '<p>Aucune couleur disponible.</p>';
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement des couleurs:', error);
        elements.colorsContainer.innerHTML = '<p>Erreur lors du chargement des couleurs.</p>';
      });
  }

  // Affichage des couleurs
  function displayColors(colors) {
    elements.colorsContainer.innerHTML = '';
    
    colors.forEach(color => {
      const colorElement = document.createElement('div');
      colorElement.className = 'color-item';
      colorElement.setAttribute('data-id', color.id);
      colorElement.style.backgroundColor = color.hex_code;
      colorElement.setAttribute('title', color.name);
      
      // Event listener pour la sélection de couleur
      colorElement.addEventListener('click', () => selectColor(color));
      
      elements.colorsContainer.appendChild(colorElement);
    });
  }

  // Sélection d'une couleur
  function selectColor(color) {
    // Mise à jour de l'état
    state.selectedColor = color;
    
    // Mise à jour de l'UI
    document.querySelectorAll('.color-item').forEach(item => {
      item.classList.remove('selected');
    });
    
    document.querySelector(`.color-item[data-id="${color.id}"]`).classList.add('selected');
    
    // Mettre à jour la visualisation
    if (state.selectedDoor && state.facade) {
      updateVisualization();
    }
  }

  // Chargement des poignées
  function loadHandles() {
    fetch('/api/handles')
      .then(response => response.json())
      .then(handles => {
        if (handles.length > 0) {
          displayHandles(handles);
        } else {
          elements.handlesContainer.innerHTML = '<p>Aucune poignée disponible.</p>';
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement des poignées:', error);
        elements.handlesContainer.innerHTML = '<p>Erreur lors du chargement des poignées.</p>';
      });
  }

  // Affichage des poignées
  function displayHandles(handles) {
    elements.handlesContainer.innerHTML = '';
    
    handles.forEach(handle => {
      const handleElement = document.createElement('div');
      handleElement.className = 'handle-item';
      handleElement.setAttribute('data-id', handle.id);
      
      const handleImage = document.createElement('img');
      handleImage.src = handle.image_path;
      handleImage.alt = handle.name;
      
      const handleName = document.createElement('p');
      handleName.textContent = handle.name;
      
      handleElement.appendChild(handleImage);
      handleElement.appendChild(handleName);
      
      // Event listener pour la sélection de poignée
      handleElement.addEventListener('click', () => selectHandle(handle));
      
      elements.handlesContainer.appendChild(handleElement);
    });
  }

  // Sélection d'une poignée
  function selectHandle(handle) {
    // Mise à jour de l'état
    state.selectedHandle = handle;
    
    // Mise à jour de l'UI
    document.querySelectorAll('.handle-item').forEach(item => {
      item.classList.remove('selected');
    });
    
    document.querySelector(`.handle-item[data-id="${handle.id}"]`).classList.add('selected');
    
    // Mettre à jour la visualisation
    if (state.selectedDoor && state.facade) {
      updateVisualization();
    }
  }

  // Chargement des motifs
  function loadPatterns() {
    fetch('/api/patterns')
      .then(response => response.json())
      .then(patterns => {
        if (patterns.length > 0) {
          displayPatterns(patterns);
        } else {
          elements.patternsContainer.innerHTML = '<p>Aucun motif disponible.</p>';
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement des motifs:', error);
        elements.patternsContainer.innerHTML = '<p>Erreur lors du chargement des motifs.</p>';
      });
  }

  // Affichage des motifs
  function displayPatterns(patterns) {
    elements.patternsContainer.innerHTML = '';
    
    patterns.forEach(pattern => {
      const patternElement = document.createElement('div');
      patternElement.className = 'pattern-item';
      patternElement.setAttribute('data-id', pattern.id);
      
      const patternImage = document.createElement('img');
      patternImage.src = pattern.image_path;
      patternImage.alt = pattern.name;
      
      const patternName = document.createElement('p');
      patternName.textContent = pattern.name;
      
      patternElement.appendChild(patternImage);
      patternElement.appendChild(patternName);
      
      // Event listener pour la sélection de motif
      patternElement.addEventListener('click', () => selectPattern(pattern));
      
      elements.patternsContainer.appendChild(patternElement);
    });
  }

  // Sélection d'un motif
  function selectPattern(pattern) {
    // Mise à jour de l'état
    state.selectedPattern = pattern;
    
    // Mise à jour de l'UI
    document.querySelectorAll('.pattern-item').forEach(item => {
      item.classList.remove('selected');
    });
    
    document.querySelector(`.pattern-item[data-id="${pattern.id}"]`).classList.add('selected');
    
    // Mettre à jour la visualisation
    if (state.selectedDoor && state.facade) {
      updateVisualization();
    }
  }

  // Mise à jour de la visualisation
  function updateVisualization() {
    // S'assurer que la façade est chargée
    if (!state.facade) return;
    
    // Nettoyer la visualisation
    elements.visualization.innerHTML = '';
    
    // Ajouter l'image de la façade
    const facadeImage = document.createElement('img');
    facadeImage.src = state.facade;
    facadeImage.alt = 'Façade';
    facadeImage.className = 'facade';
    elements.visualization.appendChild(facadeImage);
    
    // Si une porte est sélectionnée, l'ajouter
    if (state.selectedDoor) {
      const doorImage = document.createElement('img');
      doorImage.src = state.selectedDoor.image_path;
      doorImage.alt = state.selectedDoor.name;
      doorImage.className = 'door';
      
      // Appliquer la position et l'échelle
      doorImage.style.left = `${state.doorPosition.x}%`;
      doorImage.style.bottom = `${state.doorPosition.y}%`;
      doorImage.style.transform = `translate(-50%, 0) scale(${state.doorPosition.scale})`;
      
      // Appliquer la couleur si sélectionnée
      if (state.selectedColor) {
        doorImage.style.filter = `opacity(0.8) drop-shadow(0 0 0 ${state.selectedColor.hex_code})`;
      }
      
      elements.visualization.appendChild(doorImage);
      
      // Ajouter la poignée si sélectionnée
      if (state.selectedHandle) {
        const handleImage = document.createElement('img');
        handleImage.src = state.selectedHandle.image_path;
        handleImage.alt = state.selectedHandle.name;
        handleImage.className = 'door-handle';
        handleImage.style.position = 'absolute';
        handleImage.style.left = `calc(${state.doorPosition.x}% + 10px)`;
        handleImage.style.bottom = `${state.doorPosition.y}%`;
        handleImage.style.height = '10%';
        handleImage.style.transform = `translate(0, -50%) scale(${state.doorPosition.scale})`;
        handleImage.style.zIndex = '2';
        
        elements.visualization.appendChild(handleImage);
      }
      
      // Ajouter le motif/vitrage si sélectionné
      if (state.selectedPattern) {
        const patternImage = document.createElement('img');
        patternImage.src = state.selectedPattern.image_path;
        patternImage.alt = state.selectedPattern.name;
        patternImage.className = 'door-pattern';
        patternImage.style.position = 'absolute';
        patternImage.style.left = `${state.doorPosition.x}%`;
        patternImage.style.bottom = `${state.doorPosition.y}%`;
        patternImage.style.height = '15%';
        patternImage.style.transform = `translate(-50%, 0) scale(${state.doorPosition.scale})`;
        patternImage.style.zIndex = '3';
        
        elements.visualization.appendChild(patternImage);
      }
    }
  }

  // Configuration des contrôles de position
  function setupPositionControls() {
    // Déplacement à gauche
    positionButtons.left.addEventListener('click', () => {
      state.doorPosition.x = Math.max(0, state.doorPosition.x - 2);
      updateVisualization();
    });
    
    // Déplacement à droite
    positionButtons.right.addEventListener('click', () => {
      state.doorPosition.x = Math.min(100, state.doorPosition.x + 2);
      updateVisualization();
    });
    
    // Déplacement vers le haut
    positionButtons.up.addEventListener('click', () => {
      state.doorPosition.y = Math.min(100, state.doorPosition.y + 2);
      updateVisualization();
    });
    
    // Déplacement vers le bas
    positionButtons.down.addEventListener('click', () => {
      state.doorPosition.y = Math.max(0, state.doorPosition.y - 2);
      updateVisualization();
    });
    
    // Augmentation de la taille
    positionButtons.sizeIncrease.addEventListener('click', () => {
      state.doorPosition.scale = Math.min(2, state.doorPosition.scale + 0.1);
      updateVisualization();
    });
    
    // Réduction de la taille
    positionButtons.sizeDecrease.addEventListener('click', () => {
      state.doorPosition.scale = Math.max(0.5, state.doorPosition.scale - 0.1);
      updateVisualization();
    });
  }

  // Configuration des boutons d'action
  function setupActionButtons() {
    // Bouton de sauvegarde
    elements.saveButton.addEventListener('click', () => {
      elements.saveModal.style.display = 'block';
    });
    
    // Bouton de confirmation de sauvegarde
    elements.confirmSaveButton.addEventListener('click', () => {
      const projectName = elements.projectNameInput.value.trim();
      
      if (projectName === '') {
        alert('Veuillez entrer un nom pour votre projet.');
        return;
      }
      
      saveProject(projectName);
    });
    
    // Fermeture du modal
    document.querySelector('.close-modal').addEventListener('click', () => {
      elements.saveModal.style.display = 'none';
    });
    
    // Fermeture du modal en cliquant à l'extérieur
    window.addEventListener('click', (event) => {
      if (event.target === elements.saveModal) {
        elements.saveModal.style.display = 'none';
      }
    });
    
    // Bouton d'exportation
    elements.exportButton.addEventListener('click', exportImage);
  }

  // Sauvegarde du projet
  function saveProject(projectName) {
    // Création de l'objet projet
    const project = {
      project_name: projectName,
      facade_path: state.facade,
      door_id: state.selectedDoor.id,
      door_color_id: state.selectedColor ? state.selectedColor.id : null,
      handle_id: state.selectedHandle ? state.selectedHandle.id : null,
      pattern_id: state.selectedPattern ? state.selectedPattern.id : null,
      custom_settings: JSON.stringify({
        position: state.doorPosition
      })
    };
    
    // Envoi au serveur
    fetch('/api/projects/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(project)
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        alert('Projet sauvegardé avec succès!');
        elements.saveModal.style.display = 'none';
        elements.projectNameInput.value = '';
        
        // Recharger les projets sauvegardés
        loadSavedProjects();
      } else {
        alert('Erreur lors de la sauvegarde: ' + result.error);
      }
    })
    .catch(error => {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer plus tard.');
    });
  }

  // Exportation de l'image
  function exportImage() {
    // Utilisation de html2canvas pour capturer la visualisation
    html2canvas(elements.visualization).then(canvas => {
      // Création d'un lien de téléchargement
      const link = document.createElement('a');
      link.download = 'ma-porte-personnalisee.png';
      link.href = canvas.toDataURL('image/png');
      
      // Cliquer sur le lien pour déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Chargement des projets sauvegardés
  function loadSavedProjects() {
    fetch('/api/projects')
      .then(response => response.json())
      .then(projects => {
        if (projects.length > 0) {
          displaySavedProjects(projects);
        } else {
          elements.savedProjectsContainer.innerHTML = '<p class="no-projects">Aucun projet sauvegardé</p>';
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement des projets:', error);
        elements.savedProjectsContainer.innerHTML = '<p>Erreur lors du chargement des projets.</p>';
      });
  }

  // Affichage des projets sauvegardés
  function displaySavedProjects(projects) {
    elements.savedProjectsContainer.innerHTML = '';
    
    projects.forEach(project => {
      const projectElement = document.createElement('div');
      projectElement.className = 'project-item';
      projectElement.setAttribute('data-id', project.id);
      
      const projectTitle = document.createElement('h4');
      projectTitle.textContent = project.project_name;
      
      const projectInfo = document.createElement('p');
      projectInfo.textContent = `Porte: ${project.door_name}`;
      
      const projectDate = document.createElement('p');
      projectDate.className = 'project-date';
      projectDate.textContent = formatDate(project.created_at);
      
      projectElement.appendChild(projectTitle);
      projectElement.appendChild(projectInfo);
      projectElement.appendChild(projectDate);
      
      // Event listener pour charger le projet
      projectElement.addEventListener('click', () => loadProject(project));
      
      elements.savedProjectsContainer.appendChild(projectElement);
    });
  }

  // Chargement d'un projet
  function loadProject(project) {
    // Mise à jour de l'état
    state.facade = project.facade_path;
    state.doorPosition = JSON.parse(project.custom_settings).position;
    
    // Charger la porte
    fetch(`/api/doors/${project.door_id}`)
      .then(response => response.json())
      .then(door => {
        // Sélectionner la porte
        state.selectedDoor = door;
        
        // Mise à jour de l'UI pour la porte
        document.querySelectorAll('.door-item').forEach(item => {
          item.classList.remove('selected');
        });
        
        const doorElement = document.querySelector(`.door-item[data-id="${door.id}"]`);
        if (doorElement) {
          doorElement.classList.add('selected');
        }
        
        // Charger les autres éléments si présents
        if (project.door_color_id) {
          loadColor(project.door_color_id);
        }
        
        if (project.handle_id) {
          loadHandle(project.handle_id);
        }
        
        if (project.pattern_id) {
          loadPattern(project.pattern_id);
        }
        
        // Mettre à jour la visualisation
        updateVisualization();
        
        // Afficher les contrôles
        elements.doorPositioning.style.display = 'block';
        elements.colorsGroup.style.display = 'block';
        elements.handlesGroup.style.display = 'block';
        elements.patternsGroup.style.display = 'block';
        elements.saveButton.disabled = false;
        elements.exportButton.disabled = false;
      })
      .catch(error => {
        console.error('Erreur lors du chargement de la porte:', error);
        alert('Erreur lors du chargement du projet. Veuillez réessayer plus tard.');
      });
  }

  // Chargement d'une couleur spécifique
  function loadColor(colorId) {
    fetch(`/api/colors/${colorId}`)
      .then(response => response.json())
      .then(color => {
        state.selectedColor = color;
        
        document.querySelectorAll('.color-item').forEach(item => {
          item.classList.remove('selected');
        });
        
        const colorElement = document.querySelector(`.color-item[data-id="${color.id}"]`);
        if (colorElement) {
          colorElement.classList.add('selected');
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement de la couleur:', error);
      });
  }

  // Chargement d'une poignée spécifique
  function loadHandle(handleId) {
    fetch(`/api/handles/${handleId}`)
      .then(response => response.json())
      .then(handle => {
        state.selectedHandle = handle;
        
        document.querySelectorAll('.handle-item').forEach(item => {
          item.classList.remove('selected');
        });
        
        const handleElement = document.querySelector(`.handle-item[data-id="${handle.id}"]`);
        if (handleElement) {
          handleElement.classList.add('selected');
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement de la poignée:', error);
      });
  }

  // Chargement d'un motif spécifique
  function loadPattern(patternId) {
    fetch(`/api/patterns/${patternId}`)
      .then(response => response.json())
      .then(pattern => {
        state.selectedPattern = pattern;
        
        document.querySelectorAll('.pattern-item').forEach(item => {
          item.classList.remove('selected');
        });
        
        const patternElement = document.querySelector(`.pattern-item[data-id="${pattern.id}"]`);
        if (patternElement) {
          patternElement.classList.add('selected');
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement du motif:', error);
      });
  }

  // Formatage de la date
  function formatDate(dateString) {
    const date = new Date(dateString);
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Exposer certaines fonctions au scope global pour l'intégration avec upload.js
  window.appFunctions = {
    setFacadeImage: function(imagePath) {
      state.facade = imagePath;
      
      // Mettre à jour la visualisation si une porte est sélectionnée
      if (state.selectedDoor) {
        updateVisualization();
        elements.doorPositioning.style.display = 'block';
        elements.saveButton.disabled = false;
        elements.exportButton.disabled = false;
      }
    }
  };
});