// Module de personnalisation des portes (fonctionnalités supplémentaires)
document.addEventListener('DOMContentLoaded', function() {
  // Fonctionnalité de prévisualisation en temps réel
  // Sera implémentée dans une version future
  
  // Fonctionnalité d'export
  if (document.getElementById('export-image')) {
    document.getElementById('export-image').addEventListener('click', function() {
      // Vérifier si html2canvas est disponible
      if (typeof html2canvas === 'undefined') {
        // Si la bibliothèque n'est pas chargée, la charger dynamiquement
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = function() {
          exportImage();
        };
        document.head.appendChild(script);
      } else {
        exportImage();
      }
    });
  }
  
  // Fonction d'exportation d'image
  function exportImage() {
    const visualization = document.getElementById('visualization');
    
    if (!visualization) return;
    
    // Afficher un indicateur de chargement
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-overlay';
    loadingIndicator.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loadingIndicator);
    
    // Utiliser html2canvas pour capturer la visualisation
    html2canvas(visualization, {
      scale: 2, // Meilleure qualité
      useCORS: true, // Pour charger les images cross-origin
      backgroundColor: null // Fond transparent
    }).then(canvas => {
      // Créer un lien de téléchargement
      const link = document.createElement('a');
      link.download = 'ma-porte-personnalisee.png';
      link.href = canvas.toDataURL('image/png');
      
      // Cliquer sur le lien pour déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Retirer l'indicateur de chargement
      document.body.removeChild(loadingIndicator);
    }).catch(error => {
      console.error('Erreur lors de l\'exportation:', error);
      alert('Erreur lors de l\'exportation de l\'image. Veuillez réessayer plus tard.');
      
      // Retirer l'indicateur de chargement
      document.body.removeChild(loadingIndicator);
    });
  }
  
  // Ajouter des styles pour l'overlay de chargement
  addExportStyles();
  
  // Fonction pour ajouter des styles
  function addExportStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      
      .loading-spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
});