// Script d'administration
document.addEventListener('DOMContentLoaded', function() {
  // Navigation entre les sections
  setupNavigation();
  
  // Chargement des données
  loadDoors();
  loadColors();
  loadHandles();
  loadPatterns();
  loadProjects();
  
  // Formulaires d'ajout
  setupForms();
  
  // Configuration de la navigation
  function setupNavigation() {
    const navLinks = document.querySelectorAll('.admin-nav a');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Retirer la classe active de tous les liens
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Ajouter la classe active au lien cliqué
        this.classList.add('active');
        
        // Masquer toutes les sections
        document.querySelectorAll('.admin-section').forEach(section => {
          section.classList.remove('active');
        });
        
        // Afficher la section correspondante
        const sectionId = this.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');
        
        // Mettre à jour l'URL
        history.pushState(null, null, this.getAttribute('href'));
      });
    });
  }
  
  // Chargement des portes
  function loadDoors() {
    fetch('/admin/doors')
      .then(response => response.json())
      .then(doors => {
        const doorsList = document.getElementById('doors-list');
        
        if (doors.length > 0) {
          let html = '<div class="items-grid">';
          
          doors.forEach(door => {
            html += `
              <div class="admin-item" data-id="${door.id}">
                <div class="item-actions">
                  <button class="btn btn-icon delete-door" data-id="${door.id}"><i class="fas fa-trash"></i></button>
                </div>
                <img src="${door.image_path}" alt="${door.name}">
                <h4>${door.name}</h4>
                <p>${door.description || 'Aucune description'}</p>
              </div>
            `;
          });
          
          html += '</div>';
          doorsList.innerHTML = html;
          
          // Event listeners pour les boutons de suppression
          document.querySelectorAll('.delete-door').forEach(button => {
            button.addEventListener('click', function() {
              const doorId = this.getAttribute('data-id');
              deleteDoor(doorId);
            });
          });
        } else {
          doorsList.innerHTML = '<p>Aucune porte disponible. Utilisez le formulaire ci-dessus pour en ajouter.</p>';
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement des portes:', error);
        document.getElementById('doors-list').innerHTML = '<p>Erreur lors du chargement des portes.</p>';
      });
  }
  
  // Suppression d'une porte
  function deleteDoor(doorId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette porte ?')) {
      fetch(`/admin/doors/${doorId}`, {
        method: 'DELETE'
      })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            // Recharger les portes
            loadDoors();
          } else {
            alert('Erreur lors de la suppression: ' + result.error);
          }
        })
        .catch(error => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression. Veuillez réessayer plus tard.');
        });
    }
  }
  
  // Chargement des couleurs
  function loadColors() {
    fetch('/admin/colors')
      .then(response => response.json())
      .then(colors => {
        const colorsList = document.getElementById('colors-list');
        
        if (colors.length > 0) {
          let html = '<div class="items-grid">';
          
          colors.forEach(color => {
            html += `
              <div class="admin-item" data-id="${color.id}">
                <div class="color-preview" style="background-color: ${color.hex_code}"></div>
                <h4>${color.name}</h4>
                <p>${color.hex_code}</p>
                <div class="toggle">
                  <label>
                    <input type="checkbox" class="toggle-color" data-id="${color.id}" ${color.is_available ? 'checked' : ''}>
                    Disponible
                  </label>
                </div>
              </div>
            `;
          });
          
          html += '</div>';
          colorsList.innerHTML = html;
          
          // Event listeners pour les toggles
          document.querySelectorAll('.toggle-color').forEach(toggle => {
            toggle.addEventListener('change', function() {
              const colorId = this.getAttribute('data-id');
              const isAvailable = this.checked;
              
              toggleColorAvailability(colorId, isAvailable);
            });
          });
        } else {
          colorsList.innerHTML = '<p>Aucune couleur disponible. Utilisez le formulaire ci-dessus pour en ajouter.</p>';
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement des couleurs:', error);
        document.getElementById('colors-list').innerHTML = '<p>Erreur lors du chargement des couleurs.</p>';
      });
  }
  
  // Toggle disponibilité d'une couleur
  function toggleColorAvailability(colorId, isAvailable) {
    fetch(`/admin/colors/${colorId}/availability`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ is_available: isAvailable })
    })
      .then(response => response.json())
      .then(result => {
        if (!result.success) {
          alert('Erreur lors de la mise à jour de la disponibilité.');
          loadColors(); // Recharger en cas d'erreur
        }
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour:', error);
        alert('Erreur lors de la mise à jour. Veuillez réessayer plus tard.');
        loadColors(); // Recharger en cas d'erreur
      });
  }
  
  // Chargement des poignées
  function loadHandles() {
    fetch('/admin/handles')
      .then(response => response.json())
      .then(handles => {
        const handlesList = document.getElementById('handles-list');
        
        if (handles.length > 0) {
          let html = '<div class="items-grid">';
          
          handles.forEach(handle => {
            html += `
              <div class="admin-item" data-id="${handle.id}">
                <img src="${handle.image_path}" alt="${handle.name}">
                <h4>${handle.name}</h4>
                <div class="toggle">
                  <label>
                    <input type="checkbox" class="toggle-handle" data-id="${handle.id}" ${handle.is_available ? 'checked' : ''}>
                    Disponible
                  </label>
                </div>
              </div>
            `;
          });
          
          html += '</div>';
          handlesList.innerHTML = html;
          
          // Event listeners pour les toggles
          document.querySelectorAll('.toggle-handle').forEach(toggle => {
            toggle.addEventListener('change', function() {
              const handleId = this.getAttribute('data-id');
              const isAvailable = this.checked;
              
              toggleHandleAvailability(handleId, isAvailable);
            });
          });
        } else {
          handlesList.innerHTML = '<p>Aucune poignée disponible. Utilisez le formulaire ci-dessus pour en ajouter.</p>';
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement des poignées:', error);
        document.getElementById('handles-list').innerHTML = '<p>Erreur lors du chargement des poignées.</p>';
      });
  }
  
  // Toggle disponibilité d'une poignée
  function toggleHandleAvailability(handleId, isAvailable) {
    fetch(`/admin/handles/${handleId}/availability`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ is_available: isAvailable })
    })
      .then(response => response.json())
      .then(result => {
        if (!result.success) {
          alert('Erreur lors de la mise à jour de la disponibilité.');
          loadHandles(); // Recharger en cas d'erreur
        }
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour:', error);
        alert('Erreur lors de la mise à jour. Veuillez réessayer plus tard.');
        loadHandles(); // Recharger en cas d'erreur
      });
  }
  
  // Chargement des motifs
  function loadPatterns() {
    fetch('/admin/patterns')
      .then(response => response.json())
      .then(patterns => {
        const patternsList = document.getElementById('patterns-list');
        
        if (patterns.length > 0) {
          let html = '<div class="items-grid">';
          
          patterns.forEach(pattern => {
            html += `
              <div class="admin-item" data-id="${pattern.id}">
                <img src="${pattern.image_path}" alt="${pattern.name}">
                <h4>${pattern.name}</h4>
                <div class="toggle">
                  <label>
                    <input type="checkbox" class="toggle-pattern" data-id="${pattern.id}" ${pattern.is_available ? 'checked' : ''}>
                    Disponible
                  </label>
                </div>
              </div>
            `;
          });
          
          html += '</div>';
          patternsList.innerHTML = html;
          
          // Event listeners pour les toggles
          document.querySelectorAll('.toggle-pattern').forEach(toggle => {
            toggle.addEventListener('change', function() {
              const patternId = this.getAttribute('data-id');
              const isAvailable = this.checked;
              
              togglePatternAvailability(patternId, isAvailable);
            });
          });
        } else {
          patternsList.innerHTML = '<p>Aucun motif disponible. Utilisez le formulaire ci-dessus pour en ajouter.</p>';
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement des motifs:', error);
        document.getElementById('patterns-list').innerHTML = '<p>Erreur lors du chargement des motifs.</p>';
      });
  }
  
  // Toggle disponibilité d'un motif
  function togglePatternAvailability(patternId, isAvailable) {
    fetch(`/admin/patterns/${patternId}/availability`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ is_available: isAvailable })
    })
      .then(response => response.json())
      .then(result => {
        if (!result.success) {
          alert('Erreur lors de la mise à jour de la disponibilité.');
          loadPatterns(); // Recharger en cas d'erreur
        }
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour:', error);
        alert('Erreur lors de la mise à jour. Veuillez réessayer plus tard.');
        loadPatterns(); // Recharger en cas d'erreur
      });
  }
  
  // Chargement des projets
  function loadProjects() {
    fetch('/api/projects')
      .then(response => response.json())
      .then(projects => {
        const projectsList = document.getElementById('projects-list');
        
        if (projects.length > 0) {
          let html = '<div class="projects-table-container">';
          html += `
            <table class="projects-table">
              <thead>
                <tr>
                  <th>Nom du projet</th>
                  <th>Porte</th>
                  <th>Couleur</th>
                  <th>Poignée</th>
                  <th>Motif</th>
                  <th>Date de création</th>
                </tr>
              </thead>
              <tbody>
          `;
          
          projects.forEach(project => {
            html += `
              <tr>
                <td>${project.project_name}</td>
                <td>${project.door_name || 'Non spécifié'}</td>
                <td>${project.color_name || 'Non spécifié'}</td>
                <td>${project.handle_name || 'Non spécifié'}</td>
                <td>${project.pattern_name || 'Non spécifié'}</td>
                <td>${formatDate(project.created_at)}</td>
              </tr>
            `;
          });
          
          html += `
              </tbody>
            </table>
          </div>
          `;
          
          projectsList.innerHTML = html;
        } else {
          projectsList.innerHTML = '<p>Aucun projet sauvegardé.</p>';
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement des projets:', error);
        document.getElementById('projects-list').innerHTML = '<p>Erreur lors du chargement des projets.</p>';
      });
  }
  
  // Configuration des formulaires
  function setupForms() {
    // Formulaire d'ajout de porte
    document.getElementById('add-door-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const doorName = document.getElementById('door-name').value.trim();
      const doorDescription = document.getElementById('door-description').value.trim();
      const doorImage = document.getElementById('door-image').files[0];
      
      if (!doorName || !doorImage) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
      }
      
      const formData = new FormData();
      formData.append('name', doorName);
      formData.append('description', doorDescription);
      formData.append('image', doorImage);
      
      fetch('/admin/doors', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            alert('Porte ajoutée avec succès!');
            document.getElementById('add-door-form').reset();
            loadDoors();
          } else {
            alert('Erreur lors de l\'ajout: ' + result.error);
          }
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout:', error);
          alert('Erreur lors de l\'ajout. Veuillez réessayer plus tard.');
        });
    });
    
    // Formulaire d'ajout de couleur
    document.getElementById('add-color-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const colorName = document.getElementById('color-name').value.trim();
      const colorCode = document.getElementById('color-code').value.trim();
      
      if (!colorName || !colorCode) {
        alert('Veuillez remplir tous les champs.');
        return;
      }
      
      fetch('/admin/colors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: colorName,
          hex_code: colorCode
        })
      })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            alert('Couleur ajoutée avec succès!');
            document.getElementById('add-color-form').reset();
            loadColors();
          } else {
            alert('Erreur lors de l\'ajout: ' + result.error);
          }
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout:', error);
          alert('Erreur lors de l\'ajout. Veuillez réessayer plus tard.');
        });
    });
    
    // Formulaire d'ajout de poignée
    document.getElementById('add-handle-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const handleName = document.getElementById('handle-name').value.trim();
      const handleImage = document.getElementById('handle-image').files[0];
      
      if (!handleName || !handleImage) {
        alert('Veuillez remplir tous les champs.');
        return;
      }
      
      const formData = new FormData();
      formData.append('name', handleName);
      formData.append('image', handleImage);
      
      fetch('/admin/handles', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            alert('Poignée ajoutée avec succès!');
            document.getElementById('add-handle-form').reset();
            loadHandles();
          } else {
            alert('Erreur lors de l\'ajout: ' + result.error);
          }
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout:', error);
          alert('Erreur lors de l\'ajout. Veuillez réessayer plus tard.');
        });
    });
    
    // Formulaire d'ajout de motif
    document.getElementById('add-pattern-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const patternName = document.getElementById('pattern-name').value.trim();
      const patternImage = document.getElementById('pattern-image').files[0];
      
      if (!patternName || !patternImage) {
        alert('Veuillez remplir tous les champs.');
        return;
      }
      
      const formData = new FormData();
      formData.append('name', patternName);
      formData.append('image', patternImage);
      
      fetch('/admin/patterns', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            alert('Motif ajouté avec succès!');
            document.getElementById('add-pattern-form').reset();
            loadPatterns();
          } else {
            alert('Erreur lors de l\'ajout: ' + result.error);
          }
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout:', error);
          alert('Erreur lors de l\'ajout. Veuillez réessayer plus tard.');
        });
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
  
  // Ajout de styles supplémentaires
  addAdminStyles();
  
  // Fonction pour ajouter des styles
  function addAdminStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .projects-table-container {
        overflow-x: auto;
      }
      
      .projects-table {
        width: 100%;
        border-collapse: collapse;
      }
      
      .projects-table th, .projects-table td {
        padding: 10px;
        border: 1px solid var(--gray);
        text-align: left;
      }
      
      .projects-table th {
        background-color: var(--light-gray);
        font-weight: bold;
      }
      
      .projects-table tr:nth-child(even) {
        background-color: var(--light-gray);
      }
    `;
    document.head.appendChild(style);
  }
});