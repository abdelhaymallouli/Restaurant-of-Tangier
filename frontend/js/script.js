if (window.location.pathname.endsWith("restaurant.html")) {
  // Parse the URL to get the restaurant ID
  const urlParams = new URLSearchParams(window.location.search);
  const restaurantId = urlParams.get("id");

  async function fetchRestaurantDetails() {
    try {
      const response = await fetch("http://localhost:3000/restaurants");
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
    const restaurantContainer = document.getElementById("restaurant-info");
    restaurantContainer.innerHTML = `
<div class="restaurant-content">
  <img 
    src="${restaurant.image}" 
    alt="Image of ${restaurant.nom}" 
    class="restaurant-image">
  <section class="restaurant-details">
    <h1 class="restaurant-title">${restaurant.nom}</h1>
    <dl>
      <dt><strong>Speciality:</strong></dt>
      <dd>${restaurant.specialite}</dd>
      <dt><strong>Address:</strong></dt>
      <dd>${restaurant.adresse}</dd>
    </dl>
    <div class="rating">
      <p><strong>Rating:</strong></p>
      ${createStarRating(restaurant.notation)}
      <span class="rating-star">${restaurant.notation}</span>
    </div>
    <div class="contact-option">
      <h3>Contact</h3>
      <dl>
        <dt><strong>Phone:</strong></dt>
        <dd>${restaurant.Phone}</dd>
        <dt><strong>Email:</strong></dt>
        <dd>${restaurant.Email}</dd>
      </dl>
    </div>
  </section>
</div>

    `;
  }
  // Fetch and render restaurant details on page load
  fetchRestaurantDetails();
  
} else {
  // Code for the main index.html page
  async function fetchRestaurants() {
    try {
      const response = await fetch("http://localhost:3000/restaurants");
      const data = await response.json();
      console.log("Fetched data:", data);
      renderRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  }

  function renderRestaurants(restaurants) {
    const container = document.getElementById("restaurantList");
    container.innerHTML = ``;

    restaurants.forEach(restaurant => {
        const div = document.createElement("div");
        div.classList.add("restaurant-card");
        div.innerHTML = `
            <img src="${restaurant.image}" alt="${restaurant.nom}">
            <div class="restaurant-card-content">
                <h3>${restaurant.nom}</h3>
                <p>${restaurant.specialite}</p>
              <div class="rating">
                ${createStarRating(restaurant.notation)}
                <span class="rating-star">${restaurant.notation}</span>
              </div>
                <a class="details-btn" href="restaurant.html?id=${restaurant.id}">Détails</a>
            </div>
        `;
        container.appendChild(div);
    });
}
// search function 
function searchRestaurants() {
  const searchTerm = document.getElementById("search").value.toLowerCase();
  fetch("http://localhost:3000/restaurants")
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

function createStarRating(note) {
  const filledWidth = (note / 5) * 100; // Pourcentage d'étoiles pleines
  return `
    <div class="stars">
      <div class="filled" style="width: ${filledWidth}%;">★★★★★</div>
    </div>
  `;
}

