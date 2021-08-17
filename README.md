# Coda Apo Github Script

## Instructions

Toutes les instructions sont à suivre dans l'ordre.

### 1) Sur votre machine

- La première fois : clonez le repository en local.
- Installez le projet avec `npm install`.
- Créez à la racine du projet nouveau un fichier `.env` sur la base sur fichier `.env.example` : vous devez simplement intégrer votre token Github qui doit posséder les droits appropriés.
- Il ne reste plus qu'à executer `npm start`

### 2) Sur Coda

- Adaptez avec votre nom de l'organisation cible (cad dans laquelle vous souhaitez créer les assets) le contenu de la première cellule de la colonne _URL GH Part 3_ : par exemple `&githubOrga=O-clock-Uther`.
- Cliquez sur le bouton _Créer Github Teams, Repos & Users_ depuis la colonne Actions Github. Un nouvel onglet du navigateur doit s'ouvrir. Attendez d'avoir `{"result":true,"url":"https://www.github.com/votre-orga-github"}` sur ce nouvel onglet pour renouveler l'opération.


