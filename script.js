
// Automatically set active nav link based on current URL
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
  // Get current page filename
  const currentPage = window.location.pathname.split("/").pop();
  
  // Compare href with current page
  if(link.getAttribute('href') === currentPage){
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

//dropdown profile
const profileDropdown = document.getElementById("profileDropdown");
const dropdownMenu = document.getElementById("dropdownMenu");

// Toggle dropdown on avatar click
profileDropdown.addEventListener("click", function(e) {
  e.stopPropagation(); // prevent click from bubbling
  dropdownMenu.classList.toggle("active");
});

// Close dropdown when clicking outside
document.addEventListener("click", function() {
  dropdownMenu.classList.remove("active");
});


// Cart functionality
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// DOM Elements
const cartIcon = document.getElementById("cartIcon");
const cartCount = document.querySelector(".cart-count");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

// Cart Page Elements
const cartPageItems = document.getElementById("cartPageItems");
const cartPageTotal = document.getElementById("cartPageTotal");
const cartPageSubtotal = document.getElementById("cartPageSubtotal");
const cartPageTax = document.getElementById("cartPageTax");
const checkoutBtn = document.getElementById("checkoutBtn");

// Modal functionality
const modal = document.getElementById("productModal");
const closeBtn = document.querySelector(".close");
const modalMainImg = document.getElementById("modal-main-img");
const modalThumbnails = document.getElementById("modal-thumbnails");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalDescription = document.getElementById("modal-description");
const modalMaterial = document.getElementById("modal-material");
const modalFit = document.getElementById("modal-fit");
const modalCare = document.getElementById("modal-care");
const modalAvailability = document.getElementById("modal-availability");
const viewDetailsBtns = document.querySelectorAll(".view-details");

// Sample additional data for products (replace with real data/API)
const productDetails = {
  "Manfinity Homme Loose Fit Men's ": {
    images: [
      "./img/product-img/black t-shirt thumb.png",
      "./img/product-img/black t-shirt.png",
      "./img/product-img/black t-shirt2.png"
    ],
    material: "100% Cotton",
    fit: "Oversized",
    care: "Machine wash cold, tumble dry low",
    availability: "In Stock"
  },
  "Leather Jacket": {
    images: [
      "./img/product-img/leahter thumb.png",
      "./img/product-img/leather.png",
      "./img/product-img/leather2.png"
    ],
    material: "Denim",
    fit: "Slim",
    care: "Machine wash cold, hang dry",
    availability: "In Stock"
  },
  "Extreme Hoodie": {
    images: [
      "./img/product-img/hoodie thumb.png",
      "./img/product-img/hoodie.png",
      "./img/product-img/hoodie2.png"
    ],
    material: "Chiffon",
    fit: "Flowy",
    care: "Hand wash, air dry",
    availability: "In Stock"
  },
  "Graphic Tee": {
    images: [
      "./img/product-img/ch thumb.png",
      "./img/product-img/ch.png",
      "./img/product-img/ch2.png"
    ],
    material: "Cotton Blend",
    fit: "Regular",
    care: "Machine wash cold, tumble dry low",
    availability: "In Stock"
  }
};

// =============================
// INITIALIZATION
// =============================
document.addEventListener('DOMContentLoaded', function() {
  updateCartUI();
  
  // Check if we're on the cart page and initialize cart page functionality
  if (window.location.pathname.includes('cart.html')) {
    updateCartPage();
    setupCheckout();
  }
  
  // Add event listeners for filtering and sorting if on products page
  if (document.getElementById('category')) {
    setupFiltering();
  }
});

// =============================
// CART FUNCTIONALITY
// =============================

// Add to cart function
function addToCart(name, price, size, image) {
  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex(
    (item) => item.name === name && item.size === size
  );

  if (existingItemIndex !== -1) {
    // Update quantity if item already exists
    cart[existingItemIndex].quantity += 1;
  } else {
    // Add new item to cart
    cart.push({
      name,
      price,
      size,
      image,
      quantity: 1,
    });
  }

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update cart UI
  updateCartUI();

  // Show success message
  showToast(`${name} (Size: ${size}) added to cart!`);
}

// Update cart UI for header
function updateCartUI() {
  // Update cart count
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  if (cartCount) {
    cartCount.textContent = totalItems;
  }
}

// Update cart page (for cart.html)
function updateCartPage() {
  if (!cartPageItems) return;

  cartPageItems.innerHTML = "";
  let subtotal = 0;

  if (cart.length === 0) {
    cartPageItems.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <a href="products.html" class="btn empty-cart-btn">Start Shopping</a>
      </div>
    `;
    if (cartPageTotal) cartPageTotal.textContent = "₱0.00";
    if (cartPageSubtotal) cartPageSubtotal.textContent = "₱0.00";
    if (cartPageTax) cartPageTax.textContent = "₱0.00";
    if (cartCount) cartCount.textContent = "0";
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-details">Size: ${item.size}</div>
      </div>
      <div class="cart-item-price">₱${itemTotal.toFixed(2)}</div>
      <div class="cart-item-quantity">
        <button class="quantity-btn minus" data-index="${index}"><i class="fas fa-minus"></i></button>
        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
        <button class="quantity-btn plus" data-index="${index}"><i class="fas fa-plus"></i></button>
      </div>
      <button class="delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
    `;
    cartPageItems.appendChild(div);
  });

  // Update totals
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  
  if (cartPageSubtotal) cartPageSubtotal.textContent = `₱${subtotal.toFixed(2)}`;
  if (cartPageTax) cartPageTax.textContent = `₱${tax.toFixed(2)}`;
  if (cartPageTotal) cartPageTotal.textContent = `₱${total.toFixed(2)}`;
  if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Add event listeners for cart page
  addCartEventListeners();
}

function addCartEventListeners() {
  // Quantity minus buttons
  document.querySelectorAll(".quantity-btn.minus").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-index");
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartPage();
        updateCartUI(); // Also update header cart
      }
    });
  });

  // Quantity plus buttons
  document.querySelectorAll(".quantity-btn.plus").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-index");
      cart[index].quantity++;
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartPage();
      updateCartUI(); // Also update header cart
    });
  });

  // Quantity inputs
  document.querySelectorAll(".quantity-input").forEach(input => {
    input.addEventListener("change", () => {
      const index = input.getAttribute("data-index");
      const newQuantity = parseInt(input.value);
      if (newQuantity > 0) {
        cart[index].quantity = newQuantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartPage();
        updateCartUI(); // Also update header cart
      } else {
        input.value = cart[index].quantity;
      }
    });
  });

  // Delete buttons
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-index");
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartPage();
      updateCartUI(); // Also update header cart
    });
  });
}

function setupCheckout() {
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax = subtotal * 0.08;
      const total = subtotal + tax;
      
      alert(`Thank you for your purchase! Total: ₱${total.toFixed(2)}`);
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartPage();
      updateCartUI();
    });
  }
}

// =============================
// MODAL FUNCTIONALITY
// =============================

// Open modal when "View Details" is clicked
viewDetailsBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const productCard = this.closest(".product-card");
    const productTitle = productCard.querySelector("h3").textContent;
    const productPrice = productCard.querySelector(".price").textContent;
    const productDescription = productCard.querySelector("p").textContent;
    const details = productDetails[productTitle] || {
      images: [productCard.querySelector("img").src],
      material: "Cotton",
      fit: "Regular",
      care: "Machine wash",
      availability: "In Stock"
    };

    // Set main image and thumbnails
    modalMainImg.src = details.images[0];
    modalThumbnails.innerHTML = "";
    details.images.forEach((imgSrc, index) => {
      const thumbnail = document.createElement("img");
      thumbnail.src = imgSrc;
      thumbnail.alt = `Thumbnail ${index + 1}`;
      thumbnail.className = "thumbnail";
      if (index === 0) thumbnail.classList.add("active");
      thumbnail.addEventListener("click", () => {
        modalMainImg.src = imgSrc;
        document.querySelectorAll(".thumbnail").forEach(t => t.classList.remove("active"));
        thumbnail.classList.add("active");
      });
      modalThumbnails.appendChild(thumbnail);
    });

    // Set other details
    modalTitle.textContent = productTitle;
    modalPrice.textContent = productPrice;
    modalDescription.textContent = productDescription;
    modalMaterial.textContent = details.material;
    modalFit.textContent = details.fit;
    modalCare.textContent = details.care;
    modalAvailability.textContent = details.availability;

    modal.style.display = "flex";
  });
});

// Close modal when X is clicked
closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

// Close modal when clicking outside the modal content
window.addEventListener("click", function (e) {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Add to cart functionality from modal
document
  .getElementById("addToCartModal")
  .addEventListener("click", function () {
    const productName = modalTitle.textContent;
    const productPrice = parseFloat(modalPrice.textContent.replace("₱", ""));
    const selectedSize = document.getElementById("size").value;
    const productImg = modalMainImg.src;

    addToCart(productName, productPrice, selectedSize, productImg);
    modal.style.display = "none";
  });

// =============================
// TOAST NOTIFICATION
// =============================

// Show toast notification
function showToast(message) {
  if (toastMessage && toast) {
    toastMessage.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
}

// =============================
// FILTERING AND SORTING
// =============================

// Filtering and sorting functionality
function setupFiltering() {
  const categorySelect = document.getElementById('category');
  const sortSelect = document.getElementById('sort');
  const searchInput = document.getElementById('search');
  const productGrid = document.getElementById('productGrid');
  const productCards = Array.from(document.querySelectorAll('.product-card'));

  function filterAndSortProducts() {
    const selectedCategory = categorySelect.value;
    const selectedSort = sortSelect.value;
    const searchTerm = searchInput.value.toLowerCase();

    let filteredCards = productCards;

    // Filter by category
    if (selectedCategory !== 'all') {
      filteredCards = filteredCards.filter(card => card.dataset.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filteredCards = filteredCards.filter(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const productDescription = card.querySelector('p').textContent.toLowerCase();
        return productName.includes(searchTerm) || productDescription.includes(searchTerm);
      });
    }

    // Sort products
    if (selectedSort === 'name') {
      filteredCards.sort((a, b) => a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent));
    } else if (selectedSort === 'price-low') {
      filteredCards.sort((a, b) => parseFloat(a.querySelector('.price').textContent.replace('₱', '')) - parseFloat(b.querySelector('.price').textContent.replace('₱', '')));
    } else if (selectedSort === 'price-high') {
      filteredCards.sort((a, b) => parseFloat(b.querySelector('.price').textContent.replace('₱', '')) - parseFloat(a.querySelector('.price').textContent.replace('₱', '')));
    }

    // Update the grid
    productGrid.innerHTML = '';
    filteredCards.forEach(card => productGrid.appendChild(card));
  }

  // Add event listeners
  categorySelect.addEventListener('change', filterAndSortProducts);
  sortSelect.addEventListener('change', filterAndSortProducts);
  searchInput.addEventListener('input', filterAndSortProducts);
}

//adminnn
