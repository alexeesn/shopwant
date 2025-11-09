// Admin Dashboard Sidebar Functionality
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const closeSidebar = document.getElementById('closeSidebar');
  const overlay = document.getElementById('overlay');
  
  const sections = {
    dashboardSection: 'Dashboard',
    productsSection: 'Products',
    usersSection: 'Users', 
    ordersSection: 'Orders',
    addProductSection: 'Add Product',
    editProductSection: 'Edit Product'
  };

  function switchSection(sectionId) {
    Object.keys(sections).forEach(section => {
      const sectionElement = document.getElementById(section);
      if (sectionElement) sectionElement.style.display = 'none';
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) activeSection.style.display = 'block';

    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle && sections[sectionId]) pageTitle.textContent = sections[sectionId];

    const menuItems = document.querySelectorAll('.sidebar .menu li');
    menuItems.forEach(item => {
      item.classList.remove('active');
      const link = item.querySelector('a');
      if (link && link.getAttribute('data-section') === sectionId) item.classList.add('active');
    });

    if (window.innerWidth <= 1024) {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  const menuLinks = document.querySelectorAll('.sidebar .menu a[data-section]');
  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      switchSection(this.getAttribute('data-section'));
    });
  });

  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      sidebar.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeSidebar) {
    closeSidebar.addEventListener('click', function() {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (overlay) {
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 1024 && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  window.addEventListener('resize', function() {
    if (window.innerWidth > 1024) {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Add Product Form
  const addProductForm = document.getElementById('addProductForm');
  if(addProductForm) {
    addProductForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('productTitle').value;
      const description = document.getElementById('productDescription').value;
      const details = document.getElementById('productDetails').value;
      const price = document.getElementById('productPrice').value;
      const stock = document.getElementById('productStock').value;
      const featured = document.getElementById('featuredProduct').checked;
      const image = document.getElementById('productImage').files[0];

      if(!image) {
        alert('Please select a product image.');
        return;
      }

      console.log({ title, description, details, price, stock, featured, imageName: image.name });
      alert(`Product "${title}" added successfully! (Front-end only)`);
      addProductForm.reset();
    });
  }

  // Edit Product Form
  const editProductForm = document.getElementById('editProductForm');
  if(editProductForm) {
    editProductForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('editProductTitle').value;
      const description = document.getElementById('editProductDescription').value;
      const details = document.getElementById('editProductDetails').value;
      const price = document.getElementById('editProductPrice').value;
      const stock = document.getElementById('editProductStock').value;
      const featured = document.getElementById('editFeaturedProduct').checked;
      const status = document.getElementById('editProductStatus').value;

      console.log({ title, description, details, price, stock, featured, status });
      alert(`Product "${title}" updated successfully! (Front-end only)`);
      switchSection('productsSection');
    });
  }

  // Initialize with dashboard section
  switchSection('dashboardSection');
});

// Product Management Functions
let currentEditingProductId = null;

function editProduct(productId) {
  currentEditingProductId = productId;
  const productData = getProductData(productId);
  
  if (productData) {
    document.getElementById('editProductTitle').value = productData.title;
    document.getElementById('editProductDescription').value = productData.description;
    document.getElementById('editProductDetails').value = productData.details;
    document.getElementById('editProductPrice').value = productData.price;
    document.getElementById('editProductStock').value = productData.stock;
    document.getElementById('editFeaturedProduct').checked = productData.featured;
    document.getElementById('editProductStatus').value = productData.status;

    const imagePreview = document.getElementById('editImagePreview');
    imagePreview.src = productData.image;
    imagePreview.style.display = 'block';

    switchSection('editProductSection');
  }
}

function deleteProduct(productId) {
  if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
    console.log(`Deleting product: ${productId}`);
    alert(`Product ${productId} deleted successfully! (Front-end only)`);
  }
}

function deleteCurrentProduct() {
  if (currentEditingProductId) deleteProduct(currentEditingProductId);
}

function goBackToProducts() {
  switchSection('productsSection');
  currentEditingProductId = null;
}

function resetForm() {
  const form = document.getElementById('addProductForm');
  if (form) form.reset();
}

// Mock product data
function getProductData(productId) {
  const products = {
    'P101': {
      title: 'Graphic Tee',
      description: 'Comfortable and stylish graphic t-shirt',
      details: '100% Cotton, Available in S, M, L, XL',
      price: '500',
      stock: '50',
      featured: true,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    'P102': {
      title: 'Cozy Hoodie',
      description: 'Warm and comfortable hoodie for everyday wear',
      details: 'Fleece material, Available in S, M, L, XL',
      price: '1200',
      stock: '20',
      featured: false,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    'P103': {
      title: 'Classic White Shirt',
      description: 'Timeless essential white shirt',
      details: '100% Cotton, Regular fit',
      price: '800',
      stock: '0',
      featured: true,
      status: 'out-of-stock',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    }
  };
  
  return products[productId];
}

// Global switchSection function (for onclick events)
function switchSection(sectionId) {
  const sections = {
    dashboardSection: 'Dashboard',
    productsSection: 'Products',
    usersSection: 'Users', 
    ordersSection: 'Orders',
    addProductSection: 'Add Product',
    editProductSection: 'Edit Product'
  };

  Object.keys(sections).forEach(section => {
    const sectionElement = document.getElementById(section);
    if (sectionElement) sectionElement.style.display = 'none';
  });

  const activeSection = document.getElementById(sectionId);
  if (activeSection) activeSection.style.display = 'block';

  const pageTitle = document.getElementById('pageTitle');
  if (pageTitle && sections[sectionId]) pageTitle.textContent = sections[sectionId];

  const menuItems = document.querySelectorAll('.sidebar .menu li');
  menuItems.forEach(item => {
    item.classList.remove('active');
    const link = item.querySelector('a');
    if (link && link.getAttribute('data-section') === sectionId) item.classList.add('active');
  });
}
