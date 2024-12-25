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
  container.innerHTML = ""; // Clear previous content

  // Create table structure
  const table = document.createElement("table");
  table.classList.add("restaurant-table");

  // Add table header
  table.innerHTML = `
    <thead>
      <tr>
        <th>Image</th>
        <th>ID</th>
        <th>Name</th>
        <th>Speciality</th>
        <th>Address</th>
        <th>Phone</th>
        <th>Email</th>
        <th>Map</th>
        <th>Rating</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  `;

  // Add table rows
  const tbody = table.querySelector("tbody");
  restaurants.forEach((restaurant) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${restaurant.image}" alt="${restaurant.nom}" class="restaurant-image"></td>
      <td>${restaurant.id}</td>
      <td>${restaurant.nom}</td>
      <td>${restaurant.specialite}</td>
      <td>${restaurant.adresse}</td>
      <td>${restaurant.Phone}</td>
      <td><a href="mailto:${restaurant.Email}">${restaurant.Email}</a></td>
      <td><a href="${restaurant.map}" target="_blank">View Map</a></td>
      <td>${restaurant.notation}</td>
      <td>
        <button onclick="deleteRestaurant(${restaurant.id})" class="btn btn-danger">Delete</button>
        <button onclick="editRestaurant(${restaurant.id})" class="btn btn-primary">Edit</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  container.appendChild(table);
}

// Search restaurants
document.getElementById("searchButton").addEventListener("click", async () => {
  const query = document.getElementById("searchQuery").value.toLowerCase().trim();

  try {
    const response = await fetch(apiURL);
    if (!response.ok) throw new Error(`Error fetching restaurants for search: ${response.statusText}`);
    const data = await response.json();

    const filtered = data.filter((restaurant) => {
      return (
        (restaurant.nom && restaurant.nom.toLowerCase().includes(query)) ||
        (restaurant.specialite && restaurant.specialite.toLowerCase().includes(query)) ||
        (restaurant.Phone && restaurant.Phone.includes(query)) ||
        (restaurant.Email && restaurant.Email.toLowerCase().includes(query))
      );
    });

    renderRestaurantListAdmin(filtered);
  } catch (error) {
    
    console.error("Error searching restaurants:", error.message);
  }
});

// Clear search
document.getElementById("clearSearchButton").addEventListener("click", () => {
  document.getElementById("searchQuery").value = "";
  fetchRestaurantsAdmin();
});

// Initial fetch to populate the list
fetchRestaurantsAdmin();

// Add restaurant
document.getElementById("addForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = document.getElementById("addForm");
  const restaurantId = form.dataset.restaurantId;

  const newRestaurant = {
    nom: document.getElementById("addNom").value.trim(),
    specialite: document.getElementById("addSpecialite").value.trim(),
    adresse: document.getElementById("addAdresse").value.trim(),
    notation: parseFloat(document.getElementById("addNotation").value.trim()),
    Phone: document.getElementById("addPhone").value.trim(),
    Email: document.getElementById("addEmail").value.trim(),
    map: document.getElementById("addMap").value.trim(),
    image: document.getElementById("addImage").value.trim(),
  };

  // Validate inputs
  if (
    !newRestaurant.nom ||
    !newRestaurant.specialite ||
    !newRestaurant.adresse ||
    isNaN(newRestaurant.notation) || newRestaurant.notation < 1 || newRestaurant.notation > 5 ||
    !newRestaurant.Phone ||
    !newRestaurant.Email ||
    !newRestaurant.map ||
    !newRestaurant.image
  ) {
    alert("Please fill all fields correctly.");
    return;
  }

  try {
    let response;

    // Check if we are in edit mode (i.e., restaurantId exists)
    if (restaurantId) {
      // Send a PUT request for updating the restaurant
      response = await fetch(`${apiURL}/${restaurantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRestaurant),
      });

      if (!response.ok) throw new Error(`Error updating restaurant: ${response.statusText}`);
      alert("Restaurant updated successfully!");
    } else {
      // Send a POST request to add a new restaurant
      response = await fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRestaurant),
      });

      if (!response.ok) throw new Error(response.statusText);
      alert("Restaurant added successfully!");
    }

    // Reset the form and refresh the restaurant list
    resetForm();
    fetchRestaurantsAdmin();
  } catch (error) {
    console.error("Error processing restaurant:", error.message);
  }
});

// Edit a restaurant
async function editRestaurant(id) {
  try {
    const response = await fetch(`${apiURL}/${id}`);
    if (!response.ok) throw new Error(`Error fetching restaurant data: ${response.statusText}`);
    const restaurant = await response.json();

    // Pre-fill the form with current restaurant data
    document.getElementById("addNom").value = restaurant.nom;
    document.getElementById("addSpecialite").value = restaurant.specialite;
    document.getElementById("addAdresse").value = restaurant.adresse;
    document.getElementById("addPhone").value = restaurant.Phone;
    document.getElementById("addEmail").value = restaurant.Email;
    document.getElementById("addMap").value = restaurant.map;
    document.getElementById("addNotation").value = restaurant.notation.toFixed(1); // Ensure decimal precision
    document.getElementById("addImage").value = restaurant.image;

    // Set the ID in the form dataset to indicate we are editing
    const form = document.getElementById("addForm");
    form.dataset.restaurantId = id;

    // Change button text to "Update Restaurant"
    const submitButton = form.querySelector("button");
    submitButton.textContent = "Update Restaurant";
  } catch (error) {
    console.error("Error fetching restaurant:", error.message);
  }
}

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

function resetForm() {
  const form = document.getElementById("addForm");
  form.reset();
  const submitButton = form.querySelector("button");
  submitButton.textContent = "Add Restaurant";
  delete form.dataset.restaurantId; // Remove restaurant ID
}
