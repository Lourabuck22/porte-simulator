/**
 * Module de visualisation 3D pour le simulateur de portes
 * Utilise Three.js pour créer une représentation 3D de la façade avec la porte
 */

// IIFE pour éviter la pollution du scope global
(function() {
  // Variables pour stocker les références aux objets 3D
  let scene, camera, renderer, controls;
  let facadeMesh, doorMesh;
  let isInitialized = false;
  
  // Configuration de base du viewer 3D
  const config = {
    container: '3d-container',
    cameraPosition: { x: 0, y: 0, z: 10 },
    facadeSize: { width: 16, height: 9 },
    doorSize: { width: 2, height: 4 },
    lightIntensity: 1.0
  };

  // Éléments DOM
  const elements = {
    viewButton: document.getElementById('view-3d'),
    viewModal: document.getElementById('view-3d-modal'),
    rotateLeft: document.getElementById('rotate-left'),
    rotateRight: document.getElementById('rotate-right'),
    zoomIn: document.getElementById('zoom-in'),
    zoomOut: document.getElementById('zoom-out')
  };
  
  // Initialiser le module
  function init() {
    // Écouter le clic sur le bouton de visualisation 3D
    if (elements.viewButton) {
      elements.viewButton.addEventListener('click', show3DViewer);
    }
    
    // Fermeture du modal
    const closeButton = elements.viewModal ? elements.viewModal.querySelector('.close-modal') : null;
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        elements.viewModal.style.display = 'none';
        stopAnimation();
      });
    }
    
    // Fermer en cliquant à l'extérieur
    window.addEventListener('click', (event) => {
      if (event.target === elements.viewModal) {
        elements.viewModal.style.display = 'none';
        stopAnimation();
      }
    });
    
    // Initialiser les contrôles
    if (elements.rotateLeft) {
      elements.rotateLeft.addEventListener('click', () => {
        if (facadeMesh) {
          facadeMesh.rotation.y -= 0.1;
        }
      });
    }
    
    if (elements.rotateRight) {
      elements.rotateRight.addEventListener('click', () => {
        if (facadeMesh) {
          facadeMesh.rotation.y += 0.1;
        }
      });
    }
    
    if (elements.zoomIn) {
      elements.zoomIn.addEventListener('click', () => {
        if (camera) {
          camera.position.z = Math.max(5, camera.position.z - 1);
        }
      });
    }
    
    if (elements.zoomOut) {
      elements.zoomOut.addEventListener('click', () => {
        if (camera) {
          camera.position.z = Math.min(15, camera.position.z + 1);
        }
      });
    }
  }
  
  // Afficher le visualiseur 3D
  function show3DViewer() {
    // Simulation : Vérifier si une façade et une porte sont sélectionnées
    const state = getApplicationState();
    
    if (!state.facade || !state.selectedDoor) {
      alert('Veuillez sélectionner une façade et une porte avant de visualiser en 3D.');
      return;
    }
    
    // Afficher le modal
    elements.viewModal.style.display = 'block';
    
    // Initialiser Three.js au besoin
    if (!isInitialized) {
      initThreeJS();
      isInitialized = true;
    }
    
    // Mettre à jour la scène avec les données actuelles
    updateScene(state);
    
    // Démarrer l'animation
    startAnimation();
  }
  
  // Obtenir l'état actuel de l'application (façade, porte, etc.)
  function getApplicationState() {
    // Dans une vraie implémentation, vous récupéreriez cela depuis l'application principale
    // Pour cet exemple, nous simulons avec window.appState ou des valeurs par défaut
    
    const defaultState = {
      facade: document.querySelector('.visualization img.facade')?.src || null,
      selectedDoor: document.querySelector('.visualization img.door')?.src || null,
      doorPosition: {
        x: 50, // pourcentage
        y: 30, // pourcentage
        scale: 1.0
      },
      selectedColor: document.querySelector('.color-item.selected')?.style.backgroundColor || null
    };
    
    return window.appState || defaultState;
  }
  
  // Initialisation de Three.js
  function initThreeJS() {
    // Vérifier si le conteneur existe
    const container = document.getElementById(config.container);
    if (!container) {
      console.error(`Le conteneur #${config.container} n'existe pas!`);
      return;
    }
    
    // Simuler le chargement de Three.js
    // Dans une vraie implémentation, nous chargerions la bibliothèque Three.js
    console.log("Chargement de Three.js...");
    
    // Créer un placeholder pour la démo
    createPlaceholderScene(container);
  }
  
  // Création d'une scène de substitution pour la démo
  function createPlaceholderScene(container) {
    // Afficher un message indiquant que Three.js serait chargé
    container.innerHTML = `
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                  display: flex; flex-direction: column; align-items: center; justify-content: center; 
                  background-color: #f0f0f0; color: #333; padding: 20px; text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 20px;">🏠</div>
        <h3>Visualisation 3D</h3>
        <p>Dans l'application complète, votre porte serait affichée ici en 3D grâce à Three.js.</p>
        <p style="margin-top: 15px; font-size: 0.9rem;">(Simulation de l'intégration avec Three.js)</p>
        <div style="margin-top: 30px; border: 1px dashed #ccc; padding: 10px; 
                    display: flex; justify-content: space-between; width: 80%;">
          <div>🚪 Vue de face</div>
          <div>🔄 Vue en rotation</div>
          <div>✨ Vue avec éclairage</div>
        </div>
      </div>
    `;
  }
  
  // Mise à jour de la scène avec les données actuelles
  function updateScene(state) {
    // Cette fonction mettrait à jour les objets 3D avec les données actuelles
    console.log("La scène 3D serait mise à jour avec:", state);
    
    // Dans une vraie implémentation, nous mettrions à jour:
    // - La texture de la façade
    // - La texture et la position de la porte
    // - La couleur de la porte
    // - Les matériaux et l'éclairage
  }
  
  // Démarrer l'animation
  function startAnimation() {
    // Dans une vraie implémentation, nous démarrerions l'animation Three.js
    console.log("Animation de la scène 3D démarrée");
  }
  
  // Arrêter l'animation
  function stopAnimation() {
    // Dans une vraie implémentation, nous arrêterions l'animation Three.js
    console.log("Animation de la scène 3D arrêtée");
  }
  
  // Nettoyage des ressources
  function dispose() {
    // Libérer les ressources Three.js
    // Cette fonction serait appelée lors de la fermeture ou de la réinitialisation
    // de la vue 3D pour éviter les fuites de mémoire
    console.log("Ressources 3D nettoyées");
  }
  
  // Initialiser le module à l'état prêt du DOM
  document.addEventListener('DOMContentLoaded', init);
  
  // Exposer certaines fonctions pour d'autres modules
  window.Viewer3D = {
    show: show3DViewer,
    update: updateScene,
    dispose: dispose
  };
})();