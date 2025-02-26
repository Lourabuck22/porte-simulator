// Gestion de l'upload des images de façade
document.addEventListener('DOMContentLoaded', function() {
  // Éléments DOM
  const uploadArea = document.getElementById('upload-area');
  const facadeUpload = document.getElementById('facade-upload');
  const addressInput = document.getElementById('address-input');
  const searchAddressButton = document.getElementById('search-address');
  
  // Event listener pour le drag & drop
  setupDragAndDrop();
  
  // Event listener pour l'input de fichier
  facadeUpload.addEventListener('change', handleFileSelect);
  
  // Event listener pour la recherche d'adresse
  searchAddressButton.addEventListener('click', searchAddress);
  
  // Configuration du drag & drop
  function setupDragAndDrop() {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
      uploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      uploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    uploadArea.addEventListener('drop', handleDrop, false);
    
    // Cliquer sur la zone d'upload ouvre le sélecteur de fichier
    uploadArea.addEventListener('click', () => {
      facadeUpload.click();
    });
  }
  
  // Empêcher le comportement par défaut
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  // Mettre en évidence la zone de drop
  function highlight() {
    uploadArea.classList.add('highlight');
  }
  
  // Retirer la mise en évidence
  function unhighlight() {
    uploadArea.classList.remove('highlight');
  }
  
  // Gestion du drop de fichier
  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
      handleFiles(files);
    }
  }
  
  // Gestion de la sélection de fichier
  function handleFileSelect() {
    if (facadeUpload.files.length > 0) {
      handleFiles(facadeUpload.files);
    }
  }
  
  // Traitement des fichiers
  function handleFiles(files) {
    const file = files[0]; // On ne prend que le premier fichier
    
    // Vérifier que c'est bien une image
    if (!file.type.match('image.*')) {
      alert('Veuillez sélectionner une image.');
      return;
    }
    
    // Afficher un indicateur de chargement
    uploadArea.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Téléchargement en cours...</p>';
    
    // Créer un objet FormData
    const formData = new FormData();
    formData.append('facade', file);
    
    // Envoyer le fichier au serveur
    fetch('/api/upload/facade', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        // Afficher la prévisualisation
        showUploadPreview(result.file_path);
        
        // Mettre à jour l'application
        window.appFunctions.setFacadeImage(result.file_path);
      } else {
        alert('Erreur lors du téléchargement: ' + result.error);
        resetUploadArea();
      }
    })
    .catch(error => {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement. Veuillez réessayer plus tard.');
      resetUploadArea();
    });
  }
  
  // Affichage de la prévisualisation
  function showUploadPreview(imagePath) {
    // Créer une prévisualisation
    uploadArea.innerHTML = `
      <img src="${imagePath}" alt="Façade téléchargée" style="max-height: 150px;">
      <p>Façade téléchargée avec succès</p>
      <button class="btn btn-secondary" id="change-facade">Changer</button>
    `;
    
    // Event listener pour changer la façade
    document.getElementById('change-facade').addEventListener('click', resetUploadArea);
  }
  
  // Réinitialisation de la zone d'upload
  function resetUploadArea() {
    uploadArea.innerHTML = `
      <i class="fas fa-cloud-upload-alt"></i>
      <p>Glissez une image ici ou</p>
      <label for="facade-upload" class="btn">Parcourir</label>
    `;
    
    // S'assurer que l'input file est vidé
    facadeUpload.value = '';
  }
  
  // Recherche d'adresse (simulation)
  function searchAddress() {
    const address = addressInput.value.trim();
    
    if (address === '') {
      alert('Veuillez entrer une adresse.');
      return;
    }
    
    // Afficher un indicateur de chargement
    uploadArea.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Recherche en cours...</p>';
    
    // Simulation d'un délai réseau
    setTimeout(() => {
      // Dans une application réelle, vous feriez une requête à un service de géocodage et de street view
      // Pour l'exemple, on utilise une image par défaut
      const defaultFacadePath = '/img/default-facade.jpg';
      
      // Afficher la prévisualisation
      showUploadPreview(defaultFacadePath);
      
      // Mettre à jour l'application
      window.appFunctions.setFacadeImage(defaultFacadePath);
    }, 1500);
  }
});