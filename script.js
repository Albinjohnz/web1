let properties = [];
let currentSlide = 0;

// Fetch properties data from JSON file
async function fetchProperties() {
  try {
    const response = await fetch('property.json');
    properties = await response.json();

    // Initialize carousel and property cards
    if (document.getElementById("slideshow")) {
      loadCarousel(); 
      startSlideshow(); 
    }
    if (document.getElementById("property-cards")) {
      loadPropertyCards(properties); 
    } else if (window.location.pathname.endsWith("property.html")) {
      loadPropertyDetails(); 
    }
  } catch (error) {
    console.error("Failed to load properties data:", error);
  }
}

// Load JSON data when the page loads
fetchProperties();

// Load carousel images
function loadCarousel() {
  const slideshow = document.getElementById("slideshow");
  properties.slice(0, 5).forEach((property, index) => {
    const img = document.createElement("img");
    img.src = property.featuredImage;
    img.alt = property.name;
    if (index === 0) img.classList.add("active"); 
    slideshow.appendChild(img);
  });
}

// Start automatic slideshow
function startSlideshow() {
  const slides = document.querySelectorAll("#slideshow img");
  setInterval(() => {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }, 5000); 
}

// Function to load properties as cards on index.html
function loadPropertyCards(propertiesToDisplay = properties) {
  const cardContainer = document.getElementById("property-cards");
  cardContainer.innerHTML = ''; 

  propertiesToDisplay.forEach(property => {
    const card = document.createElement("div");
    card.classList.add("card");
     // Check the category and display accordingly
    const categoryLabel = property.category === 'To Let' ? 'For Rent' : 'For Sale';
    card.innerHTML = `
      <div class="card-image">
        <img src="${property.featuredImage}" alt="${property.name}">
      </div>
      <div class="card-content">
        <h3>${property.name}</h3>
        <p><strong>Location:</strong> ${property.location}</p>
        <p><strong>Price:</strong> ${property.price}</p>
        <p><strong>Bedrooms:</strong> ${property.bedrooms} | <strong>Bathrooms:</strong> ${property.bathrooms}</p>
        <h3><strong></strong> ${property.category}</h3>
        <button onclick="viewProperty(${property.id})">View Details</button>
      </div>
    `;
    cardContainer.appendChild(card);
  });
}

// Redirect to individual property page
function viewProperty(id) {
  window.location.href = `property.html?id=${id}`;
}

// Load property details for property.html
function loadPropertyDetails() {
  const params = new URLSearchParams(window.location.search);
  const propertyId = parseInt(params.get("id"));
  const property = properties.find(p => p.id === propertyId);

  if (property) {
    // Populate property info
    document.getElementById("property-info").innerHTML = `
      <h2>${property.name}</h2>
      <p><strong>Price:</strong> ${property.price}</p>
      <p><strong>Location:</strong> ${property.location}</p>
      <p><strong>BER Rating:</strong> ${property.berRating}</p>
      <p><strong>Bedrooms:</strong> ${property.bedrooms}</p>
      <p><strong>Bathrooms:</strong> ${property.bathrooms}</p>
      <p><strong>Type:</strong> ${property.type}</p>
      <p>${property.description}</p>
    `;

    // Populate property carousel with images
    const carousel = document.getElementById("property-carousel");
    carousel.innerHTML = ''; // Clear previous images
    // Add featured and other images to the carousel
    const featuredImg = document.createElement("img");
    featuredImg.src = property.featuredImage;
    featuredImg.alt = "Featured Image";
    carousel.appendChild(featuredImg);

    property.otherMedia.forEach(media => {
      const img = document.createElement("img");
      img.src = media.src;
      img.alt = "Property Image";
      carousel.appendChild(img);
    });
  } else {
    document.getElementById("property-info").innerHTML = "<p>Property not found.</p>";
  }
}

// Redirect to reservation page
function reserveViewing() {
  window.location.href = `reservation.html`;
}

// search function that displays filtered results as cards
function searchProperties() {
  const searchTerm = document.getElementById("searchBar").value.toLowerCase();
  const results = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm) || 
    property.location.toLowerCase().includes(searchTerm)
  );

  // Display search results as cards
  if (results.length > 0) {
    loadPropertyCards(results); 
  } else {
    document.getElementById("property-cards").innerHTML = "<p>No properties found matching your search.</p>";
  }
}
// Go back to the previous page
function goBack() {
    window.history.back();
  }
  
// Reservation submission function
function submitReservation(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const date = document.getElementById("date").value;

  // custom message 
  const popupMessage = `Thank you, ${name}! Your reservation for a viewing on ${date} has been submitted.`;
  document.getElementById("popup-message").innerText = popupMessage;

  // Show 
  document.getElementById("reservation-popup").style.display = "block";
}

function closePopup() {
  // Close the popup
  document.getElementById("reservation-popup").style.display = "none";
  // Go back to the previous page
  window.history.back();
}
