// Check if the current page is the restaurant details page
if (window.location.pathname.endsWith("restaurant.html")) {
    // Parse the URL to get the restaurant ID
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get("id");
  
    async function fetchRestaurantDetails() {
      try {
        const response = await fetch("http://localhost:3000/api/restaurants");
        const data = await response.json();
  
        // Find the restaurant by ID
        const restaurant = data.find(r => r.id === parseInt(restaurantId));
  
        if (restaurant) {
          renderRestaurantDetails(restaurant);
        } else {
          document.getElementById("restaurantDetails").innerHTML = "<p>Restaurant not found.</p>";
        }
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    }
  
    function renderRestaurantDetails(restaurant) {
      const detailsContainer = document.getElementById("restaurantDetails");
      detailsContainer.innerHTML = `
        <div class="restaurant-details">
          <img src="${restaurant.image}" alt="${restaurant.nom}">
          <h2>${restaurant.nom}</h2>
          <p><strong>Speciality:</strong> ${restaurant.specialite}</p>
          <p><strong>Address:</strong> ${restaurant.adresse}</p>
          <p><strong>Rating:</strong> ${restaurant.notation}</p>
        </div>
      `;
    }
  
    // Fetch and render restaurant details on page load
    fetchRestaurantDetails();
  } else {
    // Code for the main index.html page
  
    async function fetchRestaurants() {
      try {
        const response = await fetch("http://localhost:3000/api/restaurants");
        const data = await response.json();
        console.log("Fetched data:", data);
        renderRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    }
  
    function renderRestaurants(restaurants) {
      const container = document.getElementById("restaurantList");
      container.innerHTML = "";
  
      restaurants.forEach(restaurant => {
        const div = document.createElement("div");
        div.classList.add("restaurant-card");
        div.innerHTML = `
          <div class="restaurant-card">
            <img src="${restaurant.image}" alt="${restaurant.nom}">
            <h3>${restaurant.nom}</h3>
            <p>${restaurant.specialite}</p>
            <p>Rating: ${restaurant.notation}</p>
            <a href="restaurant.html?id=${restaurant.id}">Détails</a>
          </div>
        `;
        container.appendChild(div);
      });
    }
  
    function searchRestaurants() {
      const searchTerm = document.getElementById("search").value.toLowerCase();
      fetch("http://localhost:3000/api/restaurants")
        .then(response => response.json())
        .then(data => {
          const filtered = data.filter(r =>
            r.nom.toLowerCase().includes(searchTerm) || 
            r.specialite.toLowerCase().includes(searchTerm)
          );
          renderRestaurants(filtered);
        })
        .catch(error => console.error("Search Error:", error));
    }
  
    document.getElementById("searchButton").addEventListener("click", searchRestaurants);
    document.getElementById("clearButton").addEventListener("click", () => {
      document.getElementById("search").value = "";
      fetchRestaurants();
    });
  
    // Initial fetch to populate the list
    fetchRestaurants();
  }
  