async function fetchRestaurants(searchTerm = "") {
  try {
      const response = await fetch("https://restaurant-of-tangier.vercel.app/restaurants");
      const data = await response.json();
      
      // First filter the restaurants if there's a search term
      const filtered = searchTerm
          ? data.filter(r =>
              r.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
              r.specialite.toLowerCase().includes(searchTerm.toLowerCase())
          )
          : data;
      
      // Sort the filtered restaurants by notation (rating) in descending order
      const sortedRestaurants = filtered.sort((a, b) => b.notation - a.notation);
      renderRestaurants(sortedRestaurants);
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
  const searchTerm = document.getElementById("search").value.toLowerCase();
  fetchRestaurants(searchTerm);
}

document.getElementById("searchButton").addEventListener("click", searchRestaurants);
document.getElementById("clearButton").addEventListener("click", () => {
  document.getElementById("search").value = "";
  fetchRestaurants();
});

function createStarRating(note) {
  const filledWidth = (note / 5) * 100;
  return `
      <div class="stars">
          <div class="filled" style="width: ${filledWidth}%;">★★★★★</div>
      </div>
  `;
}


fetchRestaurants();