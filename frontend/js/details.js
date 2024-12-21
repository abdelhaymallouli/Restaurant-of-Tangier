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
  <section class="restaurant-info">
    <h2>${restaurant.nom}</h2>
    <p><img src="./img/location.svg" alt=""> ${restaurant.adresse}</p>
    <p>Specialite : ${restaurant.specialite}</p>
    <div class="rating-details">
      Rating : ${createStarRating(restaurant.notation)}
      <span class="rating-star">${restaurant.notation}</span>
    </div>
    <div class="contact-section">
      <h3>Contact:</h3>
      <p>Phone : ${restaurant.Phone}</p>
      <p>Email : ${restaurant.Email}</p>
    </div>
  </section>
</div>
    <section class="location-section">
    <h3>Our Map:</h3>
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

function createStarRating(note) {
  const filledWidth = (note / 5) * 100;
  return `
    <div class="stars">
      <div class="filled" style="width: ${filledWidth}%;"> ★★★★★</div>
    </div>
  `;
}

fetchRestaurantDetails();
