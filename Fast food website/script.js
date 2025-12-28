document.addEventListener("DOMContentLoaded", () => {

  /* ======================================================
       SEARCH SYSTEM
  ====================================================== */
  function doSearch(q) {
    const query = (q || "").trim().toLowerCase();
    if (!query) return alert("Please type something!");

    const map = {
      "pizza": "pizza.html",
      "burgers": "burger.html",
      "burger": "burger.html",
      "fries": "fries.html",
      "drinks": "drinks.html",
      "coke": "drinks.html",
      "kfc": "kfc.html",
      "dominos": "dominos.html",
      "mcdonald": "mcdonalds.html",
      "dessert": "dessert.html",
      "biryani": "index.html"
    };

    if (map[query]) return location.href = map[query];

    for (let key in map) {
      if (query.includes(key)) {
        location.href = map[key];
        return;
      }
    }

    alert("No result found. Redirecting to menu...");
    location.href = "index.html";
  }

  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => doSearch(searchInput.value));
    searchInput.addEventListener("keydown", e => {
      if (e.key === "Enter") doSearch(searchInput.value);
    });
  }

  /* ======================================================
       CATEGORY CLICK BUTTONS
  ====================================================== */

  document.querySelectorAll(".cat").forEach(btn => {
    btn.addEventListener("click", () => {
      const page = {
        burgers: "burger.html",
        fries: "fries.html",
        pizza: "pizza.html",
        drinks: "drinks.html",
        dessert: "dessert.html"
      }[btn.dataset.category];
      
      location.href = page || "index.html";
    });
  });

  /* ======================================================
       CART STORAGE FUNCTIONS
  ====================================================== */
  const getCart = () => JSON.parse(localStorage.getItem("ff_cart") || "[]");

  const saveCart = (cart) => {
    localStorage.setItem("ff_cart", JSON.stringify(cart));
    updateCartCount();
  };

  const updateCartCount = () => {
    const el = document.getElementById("cart-count");
    if (!el) return;
    const total = getCart().reduce((s, i) => s + i.qty, 0);
    el.textContent = total;
  };


  /* ======================================================
       ADD TO CART BUTTON HANDLING
  ====================================================== */
  document.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const cart = getCart();

      const item = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: Number(btn.dataset.price),
        img: btn.dataset.img,
        qty: 1
      };

      const exists = cart.find(i => i.id === item.id);

      if (exists) exists.qty++;
      else cart.push(item);

      saveCart(cart);

      btn.textContent = "Added ✓";
      setTimeout(() => (btn.textContent = "Add to cart"), 700);
    });
  });


  /* ======================================================
       CART PAGE (cart.html)
  ====================================================== */
  if (document.body.classList.contains("page-cart")) {
    loadCartPage();
  }

  function loadCartPage() {
    const container = document.getElementById("cart-items");
    const cart = getCart();

    if (!cart.length) {
      container.innerHTML = "<h2>Your cart is empty.</h2>";
      updateSummary(0);
      return;
    }

    container.innerHTML = "";
    let subtotal = 0;

    cart.forEach(item => {
      subtotal += item.price * item.qty;

      container.innerHTML += `
        <div class="cart-item">
          <img src="${item.img}" class="cart-thumb">

          <div class="cart-info">
            <h4>${item.name}</h4>
            <p>₹${item.price}</p>

            <div class="qty-box">
              <button onclick="updateQty('${item.id}', -1)">−</button>
              <span>${item.qty}</span>
              <button onclick="updateQty('${item.id}', 1)">+</button>
            </div>

            <button class="remove-btn" onclick="removeItem('${item.id}')">
              Remove
            </button>
          </div>
        </div>`;
    });

    updateSummary(subtotal);
  }


  /* ======================================================
       SUMMARY BOX UPDATE
  ====================================================== */
  function updateSummary(subtotal) {
    const tax = subtotal * 0.05;
    const delivery = subtotal > 0 ? 30 : 0;
    const total = subtotal + tax + delivery;

    document.getElementById("subtotal").textContent = "₹" + subtotal.toFixed(2);
    document.getElementById("tax").textContent = "₹" + tax.toFixed(2);
    document.getElementById("delivery").textContent = "₹" + delivery;
    document.getElementById("total").textContent = "₹" + total.toFixed(2);
  }


  /* ======================================================
       QUANTITY + REMOVE (global functions)
  ====================================================== */
  window.updateQty = function (id, change) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);

    if (!item) return;

    item.qty += change;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }

    saveCart(cart);
    loadCartPage();
  };

  window.removeItem = function (id) {
    let cart = getCart().filter(i => i.id !== id);
    saveCart(cart);
    loadCartPage();
  };


  /* ======================================================
       CHECKOUT FUNCTION (checkout.html)
  ====================================================== */
  window.checkout = function () {
    alert("Order placed successfully! (Demo)");
    localStorage.removeItem("ff_cart");
    location.href = "index.html";
  };


  /* ======================================================
       UPDATE CART BADGE ON PAGE LOAD
  ====================================================== */
  updateCartCount();
});
