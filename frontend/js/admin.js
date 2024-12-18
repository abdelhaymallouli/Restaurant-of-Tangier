const apiURL = "http://localhost:3000/restaurants";

// Fetch and display all restaurants
async function fetchRestaurantsAdmin() {
  try {
    const response = await fetch(apiURL);
    if (!response.ok) throw new Error(`Error fetching restaurants: ${response.statusText}`);
    const data = await response.json();
    renderRestaurantListAdmin(data);
  } catch (error) {
    console.error("Error fetching restaurants:", error.message);
  }
}

// Render restaurants for admin page
function renderRestaurantListAdmin(restaurants) {
  const container = document.getElementById("restaurantContainer");
  container.innerHTML = "";

  restaurants.forEach((restaurant) => {
    const div = document.createElement("div");
    div.classList.add("restaurant-card");
    div.innerHTML = `
      <div>
        <h3>${restaurant.nom}</h3>
        <p><strong>Speciality:</strong> ${restaurant.specialite}</p>
        <p><strong>Address:</strong> ${restaurant.adresse}</p>
        <p><strong>Rating:</strong> ${restaurant.notation}</p>
        <button onclick="deleteRestaurant(${restaurant.id})">Delete</button>
        <button onclick="editRestaurant(${restaurant.id})">Edit</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// Add a new restaurant
document.getElementById("addForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const newRestaurant = {
    nom: document.getElementById("addNom").value.trim(),
    specialite: document.getElementById("addSpecialite").value.trim(),
    adresse: document.getElementById("addAdresse").value.trim(),
    notation: parseFloat(document.getElementById("addNotation").value.trim()),
    image: document.getElementById("addImage").value.trim(),
  };

  // Validate inputs
  if (
    !newRestaurant.nom ||
    !newRestaurant.specialite ||
    !newRestaurant.adresse ||
    isNaN(newRestaurant.notation) || newRestaurant.notation < 1 || newRestaurant.notation > 5 ||
    !newRestaurant.image
  ) {
    alert("Please fill all fields correctly.");
    return;
  }

  console.log("Sending data:", JSON.stringify(newRestaurant));

  try {
    const response = await fetch(apiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRestaurant),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }

    alert("Restaurant added successfully!");
    document.getElementById("addForm").reset();
    fetchRestaurantsAdmin();
  } catch (error) {
    console.error("Error adding restaurant:", error.message);
  }
});

// Delete a restaurant
async function deleteRestaurant(id) {
  if (!confirm("Are you sure you want to delete this restaurant?")) return;

  try {
    const response = await fetch(`${apiURL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`Error deleting restaurant: ${response.statusText}`);
    alert("Restaurant deleted successfully!");
    fetchRestaurantsAdmin();
  } catch (error) {
    console.error("Error deleting restaurant:", error.message);
  }
}

// Edit a restaurant
async function editRestaurant(id) {
  const newName = prompt("Enter new name:").trim();
  const newSpeciality = prompt("Enter new speciality:").trim();
  const newAddress = prompt("Enter new address:").trim();
  const newRating = prompt("Enter new rating (1-5):").trim();
  const newImage = prompt("Enter new image URL:").trim();

  if (!newName || !newSpeciality || !newAddress || isNaN(newRating) || newRating < 1 || newRating > 5 || !newImage) {
    alert("Please fill all fields correctly.");
    return;
  }

  const updatedRestaurant = {
    nom: newName,
    specialite: newSpeciality,
    adresse: newAddress,
    notation: parseFloat(newRating),
    image: newImage,
  };

  try {
    const response = await fetch(`${apiURL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRestaurant),
    });

    if (!response.ok) throw new Error(`Error updating restaurant: ${response.statusText}`);
    alert("Restaurant updated successfully!");
    fetchRestaurantsAdmin();
  } catch (error) {
    console.error("Error updating restaurant:", error.message);
  }
}

// Search restaurants
document.getElementById("searchButton").addEventListener("click", async () => {
  const query = document.getElementById("searchQuery").value.toLowerCase().trim();

  try {
    const response = await fetch(apiURL);
    if (!response.ok) throw new Error(`Error fetching restaurants for search: ${response.statusText}`);
    const data = await response.json();

    const filtered = data.filter((restaurant) =>
      restaurant.nom.toLowerCase().includes(query) || restaurant.specialite.toLowerCase().includes(query)
    );

    renderRestaurantListAdmin(filtered);
  } catch (error) {
    console.error("Error searching restaurants:", error.message);
  }
});

// Clear search
document.getElementById("clearSearchButton").addEventListener("click", fetchRestaurantsAdmin);

// Initial fetch to populate the list
fetchRestaurantsAdmin();
