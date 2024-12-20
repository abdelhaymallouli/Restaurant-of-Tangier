const urlParams = new URLSearchParams(window.location.search);
const restaurantId = urlParams.get("id");

async function fetchRestaurantDetails() {
  try {
    const response = await fetch("http://localhost:3000/restaurants");
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

function createStarRating(note) {
  const filledWidth = (note / 5) * 100;
  return `
    <div class="stars">
      <div class="filled" style="width: ${filledWidth}%;">★★★★★</div>
    </div>
  `;
}

fetchRestaurantDetails();
