# Utiliser l'image Node.js officielle en tant que base
FROM node:18-buster

# Définir le répertoire de travail de l'application
WORKDIR /var/www/html

# Copier le package.json et le package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Copier le reste du code de l'application
COPY . .

# Exposer le port 3000 sur le conteneur
EXPOSE 3000

# Définir la commande par défaut pour l'exécution de l'application
CMD ["npm", "start"]
