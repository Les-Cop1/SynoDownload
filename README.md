# SynoDownload
## Mise en place

### Téléchargement des sources
Sur votre machine personnelle :
- Cloner le dépôt
   - SSH : [Github_SSH](git@github.com:LucasStbnr/SynoDownload.git)  
   - HTTPS : [Github_HTTPS](https://github.com/LucasStbnr/SynoDownload.git)  
- Dans le repertoire du projet, exécuter la commande suivante pour installer les dépendances  
```bash  
npm install
```

### Mise en place de l'API
Sur le NAS synology :
- Importer le fichier "/api/index.php" dans un nouveau répertoire de votre NAS que vous devez créer dans le dossier "/web"
- Aller dans l'application "Web Station"
- Dans l'onglet Virtual Host, cliquer sur "Créer"
- Cliquer sur "Basé sur le port", sélectionner "HTTP" et rentrer 500 dans l'input à coté
- Régler la racine du document sur le répertoire que vous avez créer auparavant
- Sélectionner le Serveur principal HTTP
- Sélectionner un profil PHP

### Mise en place de l'extension sur son navigateur chrome
Sur Google Chrome :
- Aller sur [chrome://extensions/](chrome://extensions/)
- Activer le mode développeur en haut à droite
- Cliquer sur "Charger l'extension non empaquetée" en haut à gauche
- Sélectionner le dossier que vous avez cloné auparavant
- Faire click droit sur l'icone de l'extension en haut à droite, puis cliquer sur "Options"
- Rentrer vos informations et cliquer sur Valider ou Tester

L'extension est maintenant en place
Vous pouvez faire click droit sur un lien et cliquer sur "Télécharger sur le NAS" pour que l'extension débride et télécharge ce lien sur le NAS
