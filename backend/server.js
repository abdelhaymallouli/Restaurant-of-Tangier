const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Importation du module cors

const app = express();

// Middleware pour gérer le CORS
app.use(cors());

// Middleware pour analyser les requêtes en JSON
app.use(express.json());

// Fonction pour lire les données des restaurants
const readRestaurantsData = () => {
    const dataPath = path.join(__dirname, 'data', 'restaurants.json');
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
    const { name, address, cuisine } = req.body;
    if (!name || !address) {
        return res.status(400).json({ message: "Name and address are required" });
    }

    const restaurants = readRestaurantsData();
    const newRestaurant = {
        id: restaurants.length > 0 ? restaurants[restaurants.length - 1].id + 1 : 1, // Génération dynamique de l'ID
        name,
        address,
        cuisine: cuisine || "General"
    };
    restaurants.push(newRestaurant);

    const dataPath = path.join(__dirname, 'data', 'restaurants.json');
    fs.writeFileSync(dataPath, JSON.stringify(restaurants, null, 2)); // Écriture dans le fichier JSON
    res.status(201).json(newRestaurant);
});

// PUT pour mettre à jour un restaurant par son ID
app.put('/restaurants/:id', (req, res) => {
    const restaurants = readRestaurantsData();
    const restaurant = restaurants.find(r => r.id === parseInt(req.params.id));
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const { name, address, cuisine } = req.body;
    if (name) restaurant.name = name;
    if (address) restaurant.address = address;
    if (cuisine) restaurant.cuisine = cuisine;

    const dataPath = path.join(__dirname, 'data', 'restaurants.json');
    fs.writeFileSync(dataPath, JSON.stringify(restaurants, null, 2)); // Sauvegarde après modification
    res.json(restaurant);
});

// DELETE pour supprimer un restaurant par son ID
app.delete('/restaurants/:id', (req, res) => {
    const restaurants = readRestaurantsData();
    const index = restaurants.findIndex(r => r.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Restaurant not found' });

    restaurants.splice(index, 1);

    const dataPath = path.join(__dirname, 'data', 'restaurants.json');
    fs.writeFileSync(dataPath, JSON.stringify(restaurants, null, 2)); // Sauvegarde après suppression
    res.status(204).send(); // Réponse sans contenu
});

// Lancement du serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
