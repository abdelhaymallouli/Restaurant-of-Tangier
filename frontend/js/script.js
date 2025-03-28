async function fetchRestaurants(searchTerm = "") {
  try {
    const response = await fetch("/api/restaurants");
    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      return;
    }
    const data = await response.json();
    console.log("API Response:", data); // Debug logging

    // Filter data if a searchTerm is provided
    if (searchTerm) {
      const filtered = data.filter(r =>
        r.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.specialite.toLowerCase().includes(searchTerm.toLowerCase())
      );
      renderRestaurants(filtered);
    } else {
      const sortedRestaurants = data.sort((a, b) => b.notation - a.notation);
      renderRestaurants(sortedRestaurants); // Show all restaurants if no search term
    }
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
      <img src="${restaurant.image}" alt="${restaurant.nom}">
      <div class="restaurant-card-content">
        <h3>${restaurant.nom}</h3>
        <p><img src="./img/Symbol.svg" >${restaurant.adresse}</p>
        <div class="rating">
          ${createStarRating(restaurant.notation)}
          <span class="rating-star">${restaurant.notation}</span>
        </div>
        <a class="details-btn" href="details.html?id=${restaurant.id}">Détails</a>
      </div>
    `;
    container.appendChild(div);
  });
}

function searchRestaurants() {
  const searchTerm = document.getElementById("search").value.trim().toLowerCase();
  fetchRestaurants(searchTerm);
}

document.getElementById("searchButton").addEventListener("click", () => {
  document.getElementById("button-container").style.display = "none";
  searchRestaurants();
});

document.getElementById("clearButton").addEventListener("click", () => {
  document.getElementById("search").value = "";
  document.getElementById("button-container").style.display = "flex";
  fetchRestaurants();
});

// Initial fetch to display all restaurants
fetchRestaurants();

function createStarRating(note) {
  const filledWidth = (note / 5) * 100; // Percentage of filled stars
  return `
    <div class="stars">
      <div class="filled" style="width: ${filledWidth}%;">★★★★★</div>
    </div>
  `;
}
