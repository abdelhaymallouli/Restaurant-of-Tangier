const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Importation du module cors
const bodyParser = require("body-parser");
const app = express();

// Middleware pour gérer le CORS
app.use(cors({
    origin: [
      'https://restaurant-of-tangier.vercel.app',
      'https://restaurant-of-tangier-*.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  

// Middlewares
app.use(bodyParser.json());

// Middleware pour analyser les requêtes en JSON
app.use(express.json());

// Add static file serving for frontend
app.use(express.static(path.join(__dirname, '../frontend')));


// Handle all other routes by serving frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
  
// Fonction pour lire les données des restaurants
const readRestaurantsData = () => {
    const dataPath = path.join(process.cwd(), 'data', 'restaurants.json');
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
};

// GET pour récupérer tous les restaurants
app.get('/restaurants', (req, res) => {
    const restaurants = readRestaurantsData();
    res.json(restaurants);
});

// GET pour récupérer un seul restaurant par son ID
app.get('/restaurants/:id', (req, res) => {
    const restaurants = readRestaurantsData();
    const restaurant = restaurants.find(r => r.id === parseInt(req.params.id));
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
});

// POST pour ajouter un nouveau restaurant
app.post('/restaurants', (req, res) => {
    const { nom, specialite, adresse, notation, Phone, Email, map, image} = req.body;
    if (!nom || !specialite || !adresse, !notation, !Phone, !Email, !map, !image) {
        return res.status(400).json({ message: "Name and address are required" });
    }

    const restaurants = readRestaurantsData();
    const newRestaurant = {
        id: restaurants.length > 0 ? restaurants[restaurants.length - 1].id + 1 : 1, // Génération dynamique de l'ID
        nom,
        specialite,
        adresse,
        notation,
        Phone,
        Email,
        map,
        image,
    };
    restaurants.push(newRestaurant);

    const dataPath = path.join(process.cwd(), 'data', 'restaurants.json');
    fs.writeFileSync(dataPath, JSON.stringify(restaurants, null, 2)); // Écriture dans le fichier JSON
    res.status(201).json(newRestaurant);
});



app.put('/restaurants/:id', (req, res) => {
    const restaurants = readRestaurantsData();
    const restaurant = restaurants.find(r => r.id === parseInt(req.params.id));
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const { nom, specialite, adresse, Phone, Email, map, image, notation } = req.body;
    
    // Update the restaurant properties
    if (nom) restaurant.nom = nom;
    if (specialite) restaurant.specialite = specialite;
    if (adresse) restaurant.adresse = adresse;
    if (Phone) restaurant.Phone = Phone;
    if (Email) restaurant.Email = Email;
    if (map) restaurant.map = map;
    if (image) restaurant.image = image;
    if (notation) restaurant.notation = notation;

    // Save the updated list back to the file
    const dataPath = path.join(process.cwd(), 'data', 'restaurants.json');
    fs.writeFileSync(dataPath, JSON.stringify(restaurants, null, 2)); // Write back to JSON file
    res.json(restaurant); // Return the updated restaurant
});


// DELETE pour supprimer un restaurant par son ID
app.delete('/restaurants/:id', (req, res) => {
    const restaurants = readRestaurantsData();
    const index = restaurants.findIndex(r => r.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Restaurant not found' });

    restaurants.splice(index, 1);

    const dataPath = path.join(process.cwd(), 'data', 'restaurants.json');
    fs.writeFileSync(dataPath, JSON.stringify(restaurants, null, 2)); // Sauvegarde après suppression
    res.status(204).send(); // Réponse sans contenu
});

// Lancement du serveur
const PORT = 3000;

// app.listen(PORT, () => {
//     console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
// });



// Add debug route at the top
app.get('/api/debug', (req, res) => {
  res.json({
    status: 'working',
    cwd: process.cwd(),
    files: fs.readdirSync(process.cwd())
  });
});

// Existing routes...

module.exports = app;
