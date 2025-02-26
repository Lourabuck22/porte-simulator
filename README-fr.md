# Simulateur de Portes

Application web (PWA) permettant de simuler l'installation de portes sur des façades de bâtiments.

## Fonctionnalités

- Upload d'images de façade ou recherche par adresse
- Sélection de portes depuis une bibliothèque
- Superposition et positionnement des portes sur la façade
- Personnalisation (couleurs, poignées, vitres, motifs)
- Sauvegarde et export des résultats
- Interface d'administration pour gérer la bibliothèque de portes

## Prérequis
- Docker et Docker Compose installés sur votre machine
- Git installé sur votre machine
- Visual Studio Code
- Extension "Dev Containers" pour VS Code (optionnel, pour une expérience de développement optimale)

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/Lourabuck22/porte-simulator.git
cd porte-simulator
```

### 2. Démarrage avec Docker

Dans le terminal de VS Code, démarrez l'application avec Docker Compose :

```bash
docker-compose up --build
```

La première exécution peut prendre quelques minutes car Docker va télécharger l'image Node.js et installer toutes les dépendances.

### 3. Accéder à l'application

Une fois le conteneur démarré, l'application sera accessible à ces adresses :
- Application principale : [http://localhost:3000](http://localhost:3000)
- Interface d'administration : [http://localhost:3000/admin](http://localhost:3000/admin)

## Structure du projet

- `server.js` : Point d'entrée de l'application
- `routes/` : Routes API et administration
- `db/init.js` : Initialisation de la base de données
- `public/` : Fichiers statiques (HTML, CSS, JS, images)
- `views/` : Templates HTML (pour l'admin)
- `uploads/` : Stockage des fichiers uploadés (persistant grâce au volume Docker)

## Persistance des données

Les données sont stockées dans :
- Une base de données SQLite (dans le dossier `db/`)
- Les uploads sont stockés dans le dossier `uploads/` (avec persistance via Docker volumes)

## Technologies utilisées

- **Frontend** : HTML, CSS, JavaScript
- **Backend** : Node.js avec Express
- **Base de données** : SQLite
- **Conteneurisation** : Docker avec volumes pour la persistance
- **Déploiement** : GitHub pour le code source
