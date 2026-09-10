const products = [
  {
    id: 'shampoo',
    name: 'Glow & Grow Shine Boost Shampoo',
    price: 299,
    image: 'images/shampoo.jpeg',
    description: 'A gentle everyday shampoo designed to leave hair feeling fresh, clean and shiny-looking.',
    category: 'haircare'
  },
  {
    id: 'conditioner',
    name: 'Glow & Grow Smooth Care Conditioner',
    price: 299,
    image: 'images/conditioner.jpeg',
    description: 'A nourishing conditioner designed for softer and smoother-looking hair.',
    category: 'haircare'
  },
  {
    id: 'serum',
    name: 'Glow & Grow Shine & Smooth Serum',
    price: 399,
    image: 'images/serum.jpeg',
    description: 'A lightweight hair serum for a smooth, polished and shiny-looking finish.',
    category: 'haircare'
  }
];

const STORAGE_KEY = 'glowAndGrowCart';

let cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function getCartItem(productId) {
  return cart.find((item) => item.id === productId);
}

function calculateCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function updateCartCounter() {
  const cartCount = document.querySelector('.cart-count');
  if (!cartCount) return;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  updateCartCounter();
  renderCartPanel();
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const existingItem = getCartItem(productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  showToast('Added to your Glow & Grow routine!');
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  showToast('Removed from your Glow & Grow routine.');
}

function decreaseQuantity(productId) {
  const item = getCartItem(productId);
  if (!item) return;

  if (item.quantity <= 1) {
    removeFromCart(productId);
    return;
  }

  item.quantity -= 1;
  saveCart();
}

function increaseQuantity(productId) {
  const item = getCartItem(productId);
  if (!item) return;
  item.quantity += 1;
  saveCart();
}

function renderCartPanel() {
  const cartPanel = document.getElementById('cartPanel');
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartTotal = document.querySelector('.cart-total');

  if (!cartPanel || !cartItemsContainer || !cartTotal) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Your Glow & Grow routine is empty.</p>';
    cartTotal.textContent = '₹0';
    updateCartCounter();
    return;
  }

  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item" data-id="${item.id}">
          <div class="item-meta">
            <strong>${item.name}</strong>
            <small>₹${item.price} each</small>
            <div class="qty-controls">
              <button type="button" class="qty-btn minus" data-id="${item.id}" aria-label="Decrease quantity">-</button>
              <span>${item.quantity}</span>
              <button type="button" class="qty-btn plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div>
            <div>₹${item.price * item.quantity}</div>
            <button type="button" class="remove-item" data-id="${item.id}">Remove</button>
          </div>
        </div>
      `
    )
    .join('');

  cartTotal.textContent = `₹${calculateCartTotal()}`;
  updateCartCounter();
}

function setupCartPanel() {
  const cartBtn = document.querySelector('.cart-btn');
  const cartPanel = document.getElementById('cartPanel');
  const closeCart = document.querySelector('.close-cart');

  if (!cartBtn || !cartPanel) return;

  cartBtn.addEventListener('click', () => {
    cartPanel.classList.toggle('open');
  });

  if (closeCart) {
    closeCart.addEventListener('click', () => cartPanel.classList.remove('open'));
  }

  document.addEventListener('click', (event) => {
    const clickedInsideCart = cartPanel.contains(event.target);
    const clickedCartButton = cartBtn.contains(event.target);
    if (!clickedInsideCart && !clickedCartButton) {
      cartPanel.classList.remove('open');
    }
  });

  cartPanel.addEventListener('click', (event) => {
    const removeButton = event.target.closest('.remove-item');
    const minusButton = event.target.closest('.minus');
    const plusButton = event.target.closest('.plus');

    if (removeButton) {
      removeFromCart(removeButton.dataset.id);
    }

    if (minusButton) {
      decreaseQuantity(minusButton.dataset.id);
    }

    if (plusButton) {
      increaseQuantity(plusButton.dataset.id);
    }
  });

  const checkoutButton = document.querySelector('.checkout-btn');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      showToast('Demo checkout — payment integration can be added later.');
    });
  }
}

function setupNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
      if (navMenu) navMenu.classList.remove('open');
    });
  });
}

function setupRevealAnimations() {
  const revealItems = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupHomeActions() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach((button) => {
    button.addEventListener('click', () => {
      addToCart(button.dataset.productId);
    });
  });

  const buildRoutineButton = document.querySelector('.routine-trigger');
  if (buildRoutineButton) {
    buildRoutineButton.addEventListener('click', () => {
      showToast('Your Glow & Grow routine is ready!');
    });
  }

  const routineReadyButton = document.querySelector('.routine-ready');
  if (routineReadyButton) {
    routineReadyButton.addEventListener('click', () => {
      showToast('Your Glow & Grow routine is ready!');
    });
  }

  const quizButton = document.getElementById('quizButton');
  const resultCard = document.querySelector('.result-card');

  if (quizButton) {
    quizButton.addEventListener('click', () => {
      const hairConcern = document.querySelector('input[name="hairConcern"]:checked');
      const hairGoal = document.querySelector('input[name="hairGoal"]:checked');

      if (!hairConcern || !hairGoal) {
        showToast('Please choose answers to complete your match.');
        return;
      }

      const concern = hairConcern.value;
      const goal = hairGoal.value;
      const resultText = document.getElementById('resultText');

      let recommendation = 'Shine Boost Shampoo';

      if (concern === 'Dullness' && goal === 'Shine') {
        recommendation = 'Shine Boost Shampoo';
      } else if (concern === 'Frizz' && goal === 'Smoothness') {
        recommendation = 'Smooth Care Conditioner + Shine & Smooth Serum';
      } else if (concern === 'Dryness' && goal === 'Softness') {
        recommendation = 'Smooth Care Conditioner';
      } else if (goal === 'Shine') {
        recommendation = 'Shine Boost Shampoo';
      } else if (goal === 'Smoothness' || concern === 'Frizz') {
        recommendation = 'Smooth Care Conditioner + Shine & Smooth Serum';
      } else if (goal === 'Softness' || concern === 'Dryness') {
        recommendation = 'Smooth Care Conditioner';
      } else if (goal === 'Everyday nourishment' || concern === 'Roughness') {
        recommendation = 'Smooth Care Conditioner';
      }

      if (resultText) resultText.textContent = `Your Glow & Grow Match: ${recommendation}`;
      if (resultCard) resultCard.classList.remove('hidden');
      showToast('Your Glow & Grow match is ready!');
    });
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function handleLoginForm() {
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');

  if (!loginForm || !loginMessage) return;

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email) {
      loginMessage.textContent = 'Please enter your email.';
      loginMessage.className = 'form-message error';
      return;
    }

    if (!validateEmail(email)) {
      loginMessage.textContent = 'Please enter a valid email address.';
      loginMessage.className = 'form-message error';
      return;
    }

    if (!password) {
      loginMessage.textContent = 'Please enter your password.';
      loginMessage.className = 'form-message error';
      return;
    }

    loginMessage.textContent = 'Login successful! Welcome back.';
    loginMessage.className = 'form-message success';
    showToast('Login successful! Welcome back.');
    loginForm.reset();
  });
}

function handleRegisterForm() {
  const registerForm = document.getElementById('registerForm');
  const registerMessage = document.getElementById('registerMessage');

  if (!registerForm || !registerMessage) return;

  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!name || !email || !password || !confirmPassword) {
      registerMessage.textContent = 'All fields are required.';
      registerMessage.className = 'form-message error';
      return;
    }

    if (!validateEmail(email)) {
      registerMessage.textContent = 'Please enter a valid email address.';
      registerMessage.className = 'form-message error';
      return;
    }

    if (password.length < 6) {
      registerMessage.textContent = 'Password must be at least 6 characters long.';
      registerMessage.className = 'form-message error';
      return;
    }

    if (password !== confirmPassword) {
      registerMessage.textContent = 'Passwords do not match.';
      registerMessage.className = 'form-message error';
      return;
    }

    registerMessage.textContent = 'Welcome to Glow & Grow! Your account has been created.';
    registerMessage.className = 'form-message success';
    showToast('Welcome to Glow & Grow! Your account has been created.');
    registerForm.reset();
  });
}

function handleContactForm() {
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactMessageStatus');

  if (!contactForm || !contactStatus) return;

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) {
      contactStatus.textContent = 'Please fill in all fields.';
      contactStatus.className = 'form-message error';
      return;
    }

    if (!validateEmail(email)) {
      contactStatus.textContent = 'Please enter a valid email address.';
      contactStatus.className = 'form-message error';
      return;
    }

    contactStatus.textContent = 'Thank you! Your message has been received.';
    contactStatus.className = 'form-message success';
    showToast('Thank you! Your message has been received.');
    contactForm.reset();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupCartPanel();
  renderCartPanel();
  setupRevealAnimations();
  setupHomeActions();
  handleLoginForm();
  handleRegisterForm();
  handleContactForm();
});
