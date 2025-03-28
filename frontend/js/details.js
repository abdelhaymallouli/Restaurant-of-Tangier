const urlParams = new URLSearchParams(window.location.search);
const restaurantId = urlParams.get("id");

async function fetchRestaurantDetails() {
  try {
    const response = await fetch("/api/restaurants");
    const data = await response.json();

    const restaurant = data.find(r => r.id === parseInt(restaurantId));

    if (restaurant) {
      renderRestaurantDetails(restaurant);
    } else {
      document.getElementById("restaurant-info").innerHTML = "<p>Restaurant not found.</p>";
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
  <section class="restaurant-info">
    <h2>${restaurant.nom}</h2>
    <p class="address"><img src="./img/location.svg" alt="Location icon"> ${restaurant.adresse}</p>
    <p class="speciality"><strong>Speciality: </strong> ${restaurant.specialite}</p>
    <div class="rating-details">
      <span class="rating-label">Rating:</span>
      ${createStarRating(restaurant.notation)}
      <span class="rating-star">${restaurant.notation}</span>
    </div>
    <div class="contact-section">
      <h3>Contact :</h3>
      <p><strong>Phone :</strong> ${restaurant.Phone}</p>
      <p><strong>Email :</strong> ${restaurant.Email}</p>
    </div>
  </section>
</div>
<section class="location-section">
  <h3>Location</h3>
  <iframe 
    src="${restaurant.map}" 
    width="100%" 
    height="400" 
    style="border:0;" 
    allowfullscreen="" 
    loading="lazy" 
    referrerpolicy="no-referrer-when-downgrade">
  </iframe>
</section>
  `;
}


async function fetchRestaurants() {
  try {
    const response = await fetch("http://localhost:3000/restaurants");
    const data = await response.json();
      renderRestaurants(data);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
  }
}

function renderRestaurants(restaurants) {
  const container = document.getElementById("other_restaurant");
  container.innerHTML = "";

  // Shuffle the restaurants array
  const shuffledRestaurants = restaurants.sort(() => Math.random() - 0.5);

  // Select the first 3 restaurants after shuffling
  const limitedRestaurants = shuffledRestaurants.slice(0, 3);

  limitedRestaurants.forEach(restaurant => {
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


function createStarRating(note) {
  const filledWidth = (note / 5) * 100;
  return `
    <div class="stars">
      <div class="filled" style="width: ${filledWidth}%;"> ★★★★★</div>
    </div>
  `;
}
fetchRestaurants();
fetchRestaurantDetails();
