const menuToggle = document.querySelector(".menu-toggle");
const sideMenu = document.querySelector(".side-menu");
const closeMenu = document.querySelector(".close-menu");
const menuLinks = document.querySelectorAll(".side-menu a");
const slides = document.querySelectorAll(".slide");
const slideLines = document.querySelectorAll(".slide-line");
const prevSlideButton = document.querySelector(".carousel-prev");
const nextSlideButton = document.querySelector(".carousel-next");
const hero = document.querySelector(".hero");
const scrollBrandBar = document.querySelector(".scroll-brand-bar");
const firstInfoButton = document.querySelector('[aria-controls="firstCookieDetails"]');
const firstCookieDetails = document.querySelector("#firstCookieDetails");
const productsCarousel = document.querySelector(".products-carousel");
const productsPrev = document.querySelector(".products-prev");
const productsNext = document.querySelector(".products-next");
const productButtons = document.querySelectorAll(".product-more");
const favoriteButtons = document.querySelectorAll(".favorite-toggle");
const addToCartButtons = document.querySelectorAll(".add-to-cart");
const productQuantityControls = document.querySelectorAll(".product-order-controls");
const productDetail = document.querySelector("#productDetail");
const productDetailClose = document.querySelector(".product-detail-close");
const cartToggle = document.querySelector(".cart-toggle");
const cartClose = document.querySelector(".cart-close");
const orderCart = document.querySelector("#orderCart");
const cartItems = document.querySelector(".cart-items");
const cartCount = document.querySelector(".cart-count");
const cartForm = document.querySelector(".cart-form");
const deliveryDateInput = document.querySelector('[name="deliveryTime"]');
const deliveryDaySelect = document.querySelector('[name="deliveryDay"]');
const deliveryMonthSelect = document.querySelector('[name="deliveryMonth"]');
const deliveryYearSelect = document.querySelector('[name="deliveryYear"]');
const deliveryDateError = document.querySelector("#deliveryDateError");
const verifyAvailabilityButton = document.querySelector(".verify-availability");
const cartWhatsapp = document.querySelector(".cart-whatsapp");
const collageCookieMark = document.querySelector(".collage-logo");
let productCarouselOpenScrollY = null;
let verifiedDeliveryDate = "";
const cart = new Map();
const cartStorageKey = "mookieCharmCart";
const whatsappOrderUrl = "https://wa.me/5217711989704";
const maxProductQuantity = 50;

let activeSlide = 0;
let slideTimer = slides.length ? window.setInterval(showNextSlide, 4500) : null;

function openMenu() {
  if (!sideMenu || !menuToggle) return;
  sideMenu.classList.add("is-open");
  menuToggle.setAttribute("aria-expanded", "true");
  sideMenu.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
  closeMenu?.focus();
}

function closeSideMenu() {
  if (!sideMenu || !menuToggle) return;
  sideMenu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  sideMenu.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
}

function showSlide(index) {
  if (!slides.length) return;
  slides[activeSlide].classList.remove("is-active");
  slideLines[activeSlide]?.classList.remove("is-active");
  activeSlide = (index + slides.length) % slides.length;
  slides[activeSlide].classList.add("is-active");
  slideLines[activeSlide]?.classList.add("is-active");
}

function showNextSlide() {
  showSlide(activeSlide + 1);
}

function showPrevSlide() {
  showSlide(activeSlide - 1);
}

function restartSlider() {
  if (!slides.length) return;
  window.clearInterval(slideTimer);
  slideTimer = window.setInterval(showNextSlide, 4500);
}

function updateScrollBrandBar() {
  const isPastHero = !hero || window.scrollY >= hero.offsetTop + hero.offsetHeight - 1;
  scrollBrandBar?.classList.toggle("is-visible", isPastHero);
  cartToggle?.classList.toggle("is-app-colored", isPastHero);
}

function updateCookieRotation() {
  if (!collageCookieMark) return;
  collageCookieMark.style.setProperty("--cookie-rotation", `${window.scrollY * 0.22}deg`);
}

function toggleFirstCookieDetails() {
  if (!firstInfoButton || !firstCookieDetails) return;
  const isOpen = firstCookieDetails.classList.toggle("is-open");
  firstInfoButton.setAttribute("aria-expanded", String(isOpen));
  firstCookieDetails.setAttribute("aria-hidden", String(!isOpen));
  firstInfoButton.textContent = isOpen ? "Ver menos" : "Más información";

  if (!isOpen) {
    firstInfoButton.blur();
  }
}

menuToggle?.addEventListener("click", openMenu);
closeMenu?.addEventListener("click", closeSideMenu);
firstInfoButton?.addEventListener("click", toggleFirstCookieDetails);

menuLinks.forEach((link) => {
  link.addEventListener("click", closeSideMenu);
});

prevSlideButton?.addEventListener("click", () => {
  showPrevSlide();
  restartSlider();
});

nextSlideButton?.addEventListener("click", () => {
  showNextSlide();
  restartSlider();
});

slideLines.forEach((line, index) => {
  line.addEventListener("click", () => {
    showSlide(index);
    restartSlider();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSideMenu();
    closeCart();
  }
});

window.addEventListener("scroll", () => {
  updateScrollBrandBar();
  updateCookieRotation();
});
window.addEventListener("resize", updateScrollBrandBar);
updateScrollBrandBar();
updateCookieRotation();

const productInformation = {
  cocoa: {
    name: "Cocoa con Chocolate",
    description: "Una galleta de sabor intenso, centro suave y generosos trozos de chocolate semiamargo.",
    highlights: ["Cacao intenso", "Centro suave", "Chocolate semiamargo"]
  },
  brownie: {
    name: "Tipo Brownie",
    description: "Crujiente por fuera, húmeda por dentro y con el sabor profundo de un brownie recién horneado.",
    highlights: ["Chocolate", "Textura suave", "Sabor profundo"]
  },
  "red-velvet": {
    name: "Red Velvet",
    description: "Nuestra favorita: una galleta aterciopelada con chocolate blanco y un delicado sabor a cacao.",
    highlights: ["Chocolate blanco", "Suave", "Favorita"]
  },
  avellana: {
    name: "Avellana Royal",
    description: "Una mezcla cremosa de avellana, chocolate y textura crujiente creada para sorprender.",
    highlights: ["Avellana", "Chocolate", "Nueva"]
  },
  mantequilla: {
    name: "Mantequilla con Chocolate",
    description: "La combinación clásica de mantequilla y chocolate en una galleta aromática y reconfortante.",
    highlights: ["Mantequilla", "Chocolate", "Clásica"]
  },
  "cocoa-intensa": {
    name: "Cocoa Intensa",
    description: "Cacao profundo y dulzura equilibrada en una pieza suave, abundante y llena de carácter.",
    highlights: ["Cacao", "Intensa", "Artesanal"]
  }
};

function clampQuantity(value) {
  const quantity = Number.parseInt(value, 10);
  if (Number.isNaN(quantity)) return 1;
  return Math.min(maxProductQuantity, Math.max(1, quantity));
}

function getProductName(productId) {
  return productInformation[productId]?.name || productId;
}

function setInputQuantity(input, value) {
  if (!input) return;
  input.value = String(clampQuantity(value));
}

function saveCart() {
  try {
    const cartData = Array.from(cart.entries()).map(([productId, item]) => ({
      productId,
      quantity: item.quantity
    }));
    localStorage.setItem(cartStorageKey, JSON.stringify(cartData));
  } catch (error) {
    // El carrito sigue funcionando aunque el navegador bloquee localStorage.
  }
}

function loadSavedCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
    if (!Array.isArray(savedCart)) return;
    savedCart.forEach((item) => {
      if (!item?.productId) return;
      cart.set(item.productId, {
        name: getProductName(item.productId),
        quantity: clampQuantity(item.quantity)
      });
    });
  } catch (error) {
    cart.clear();
  }
}

function openCart() {
  if (!orderCart || !cartToggle) return;
  orderCart.classList.add("is-open");
  orderCart.setAttribute("aria-hidden", "false");
  cartToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("cart-open");
}

function closeCart() {
  if (!orderCart || !cartToggle) return;
  orderCart.classList.remove("is-open");
  orderCart.setAttribute("aria-hidden", "true");
  cartToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("cart-open");
}

function updateCartCount() {
  if (!cartCount) return;
  const total = Array.from(cart.values()).reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = String(total);
  cartToggle?.classList.toggle("has-items", total > 0);
  cartToggle?.setAttribute("aria-label", total > 0 ? `Abrir carrito, ${total} productos` : "Abrir carrito vacio");
}

function updateCartItem(productId, quantity) {
  if (!productId) return;
  const normalizedQuantity = clampQuantity(quantity);
  if (cart.has(productId)) {
    cart.get(productId).quantity = normalizedQuantity;
  } else {
    cart.set(productId, {
      name: getProductName(productId),
      quantity: normalizedQuantity
    });
  }
  saveCart();
  renderCart();
}

function addProductToCart(productId, quantity) {
  if (!productId) return;
  const current = cart.get(productId)?.quantity || 0;
  cart.set(productId, {
    name: getProductName(productId),
    quantity: Math.min(maxProductQuantity, current + clampQuantity(quantity))
  });
  saveCart();
  renderCart();
  openCart();
}

function removeCartItem(productId) {
  if (!productId) return;
  cart.delete(productId);
  saveCart();
  renderCart();
}

function getProductsLink() {
  return document.querySelector("#sabores") ? "#sabores" : "index.html#sabores";
}

function renderCart() {
  if (!cartItems) return;
  updateCartCount();

  if (!cart.size) {
    cartItems.innerHTML = `<a class="cart-empty" href="${getProductsLink()}">Agregar galletas</a>`;
    updateCartWhatsappState();
    return;
  }

  cartItems.innerHTML = Array.from(cart.entries()).map(([productId, item]) => `
    <article class="cart-item" data-product="${productId}">
      <div>
        <strong>${item.name}</strong>
      </div>
      <div class="quantity-control" aria-label="Cantidad de ${item.name}">
        <button class="quantity-step" type="button" data-action="decrease" aria-label="Disminuir cantidad">-</button>
        <input class="quantity-input" type="number" min="1" max="${maxProductQuantity}" value="${item.quantity}" inputmode="numeric" aria-label="Cantidad">
        <button class="quantity-step" type="button" data-action="increase" aria-label="Aumentar cantidad">+</button>
      </div>
      <button class="cart-remove" type="button" data-product="${productId}" aria-label="Vaciar ${item.name} del carrito">
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/>
        </svg>
      </button>
    </article>
  `).join("");
  updateCartWhatsappState();
}

function buildWhatsappMessage() {
  const formData = new FormData(cartForm);
  const name = String(formData.get("customerName") || "").trim();
  const deliveryTime = String(formData.get("deliveryTime") || "").trim();
  const orderNotes = String(formData.get("orderNotes") || "").trim();
  const orderLines = Array.from(cart.values())
    .map((item) => `- ${item.name}: ${item.quantity} galleta${item.quantity === 1 ? "" : "s"}`)
    .join("\n");
  const details = [
    `Nombre: ${name}`,
    deliveryTime ? `Fecha de entrega: ${deliveryTime}` : null,
    orderNotes ? `Detalles: ${orderNotes}` : null
  ].filter(Boolean).join("\n");

  return `Hola, soy ${name}. Quiero continuar mi orden en Mookie Charm.\n\nPedido:\n${orderLines}\n\nDatos:\n${details}`;
}

function buildAvailabilityMessage() {
  updateDeliveryDateValue();
  const deliveryTime = deliveryDateInput?.value || "";
  return `Hola, quiero preguntar si tienen disponibilidad para el dia ${deliveryTime}.`;
}

function verifyAvailabilityOnWhatsapp() {
  updateDeliveryDateValue();
  if (!deliveryDateInput?.value) {
    validateDeliveryDate(true);
    return;
  }

  verifiedDeliveryDate = deliveryDateInput.value;
  const message = encodeURIComponent(buildAvailabilityMessage());
  window.open(`${whatsappOrderUrl}?text=${message}`, "_blank", "noopener");
  updateCartWhatsappState();
}

function continueOrderOnWhatsapp() {
  if (!cartForm || !cartWhatsapp) return;
  if (!cart.size) {
    openCart();
    cartItems?.querySelector(".cart-empty")?.scrollIntoView({ block: "center", behavior: "smooth" });
    return;
  }
  validateDeliveryDate(true);
  if (!cartForm.reportValidity()) return;
  if (verifiedDeliveryDate !== deliveryDateInput?.value) {
    verifyAvailabilityButton?.focus();
    return;
  }

  const message = encodeURIComponent(buildWhatsappMessage());
  window.open(`${whatsappOrderUrl}?text=${message}`, "_blank", "noopener");
}

function fillDateOptions() {
  if (!deliveryDaySelect || !deliveryMonthSelect || !deliveryYearSelect) return;

  for (let day = 1; day <= 31; day += 1) {
    const value = String(day).padStart(2, "0");
    deliveryDaySelect.add(new Option(value, value));
  }

  for (let month = 1; month <= 12; month += 1) {
    const value = String(month).padStart(2, "0");
    deliveryMonthSelect.add(new Option(value, value));
  }

  const currentYear = new Date().getFullYear();
  const firstYear = Math.max(2026, currentYear);
  for (let year = firstYear; year <= firstYear + 10; year += 1) {
    deliveryYearSelect.add(new Option(String(year), String(year)));
  }
}

function updateDeliveryDateValue() {
  if (!deliveryDateInput || !deliveryDaySelect || !deliveryMonthSelect || !deliveryYearSelect) return;
  const day = deliveryDaySelect.value;
  const month = deliveryMonthSelect.value;
  const year = deliveryYearSelect.value;
  deliveryDateInput.value = day && month && year ? `${day}/${month}/${year}` : "";
}

function validateDeliveryDate(showIncomplete = false) {
  updateDeliveryDateValue();
  if (!deliveryDateInput) return true;
  const message = showIncomplete && !deliveryDateInput.value ? "Elige dia, mes y a\u00f1o de entrega." : "";

  deliveryDateInput.setCustomValidity(message);
  if (deliveryDateError) {
    deliveryDateError.textContent = message;
  }
  return !message;
}

function updateCartWhatsappState() {
  if (!cartWhatsapp || !cartForm) return;
  validateDeliveryDate(false);
  const selectedDeliveryDate = deliveryDateInput?.value || "";
  const isAvailabilityVerified = Boolean(selectedDeliveryDate) && verifiedDeliveryDate === selectedDeliveryDate;
  if (verifyAvailabilityButton) {
    verifyAvailabilityButton.disabled = !selectedDeliveryDate;
    verifyAvailabilityButton.classList.toggle("is-verified", isAvailabilityVerified);
    verifyAvailabilityButton.textContent = isAvailabilityVerified ? "Disponibilidad verificada" : "Verificar disponibilidad";
  }
  cartWhatsapp.disabled = !cart.size || !cartForm.checkValidity() || !isAvailabilityVerified;
}

function scrollProducts(direction) {
  if (!productsCarousel) return;
  const card = productsCarousel.querySelector(".product-card");
  const gap = parseFloat(getComputedStyle(productsCarousel).gap) || 24;
  productsCarousel.scrollBy({
    left: direction * ((card?.offsetWidth || 300) + gap),
    behavior: "smooth"
  });
}

function closeProductDetail(restorePosition = false) {
  if (!productDetail) return;
  productDetail.classList.remove("is-open");
  productDetail.setAttribute("aria-hidden", "true");
  productButtons.forEach((button) => {
    button.setAttribute("aria-expanded", "false");
    button.textContent = "Ver más";
  });

  if (restorePosition && productCarouselOpenScrollY !== null) {
    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: productCarouselOpenScrollY,
        behavior: "smooth"
      });
    });
  }
}

function scrollToProductDetail() {
  if (!productDetail) return;
  window.requestAnimationFrame(() => {
    productDetail.scrollIntoView({
      block: "start",
      behavior: "smooth"
    });
  });
}

function showProductDetail(button) {
  if (!productDetail) return;
  const information = productInformation[button.dataset.product];
  if (!information) return;
  const wasSelected = button.getAttribute("aria-expanded") === "true";
  closeProductDetail(false);
  if (wasSelected) {
    closeProductDetail(true);
    return;
  }

  productCarouselOpenScrollY = window.scrollY;
  productDetail.querySelector("h2").textContent = information.name;
  productDetail.querySelector(".product-detail-description").textContent = information.description;
  productDetail.querySelector(".product-detail-highlights").innerHTML =
    information.highlights.map((item) => `<span>${item}</span>`).join("");
  productDetail.classList.add("is-open");
  productDetail.setAttribute("aria-hidden", "false");
  button.setAttribute("aria-expanded", "true");
  button.textContent = "Ver menos";
  scrollToProductDetail();
}

function getFavoriteProductName(button) {
  return button.closest(".product-card")?.querySelector("h2")?.textContent?.trim() || "esta galleta";
}

function updateFavoriteButton(button, isFavorite) {
  const productName = getFavoriteProductName(button);
  button.classList.toggle("is-favorite", isFavorite);
  button.setAttribute("aria-pressed", String(isFavorite));
  button.setAttribute(
    "aria-label",
    isFavorite ? `Quitar ${productName} de favoritas` : `Marcar ${productName} como favorita`
  );
}

productsPrev?.addEventListener("click", () => scrollProducts(-1));
productsNext?.addEventListener("click", () => scrollProducts(1));
productDetailClose?.addEventListener("click", () => closeProductDetail(true));
productButtons.forEach((button) => {
  button.addEventListener("click", () => showProductDetail(button));
});
favoriteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    updateFavoriteButton(button, button.getAttribute("aria-pressed") !== "true");
  });
});

cartToggle?.addEventListener("click", openCart);
cartClose?.addEventListener("click", closeCart);
orderCart?.addEventListener("click", (event) => {
  if (event.target === orderCart) {
    closeCart();
  }
});

productQuantityControls.forEach((control) => {
  const input = control.querySelector(".quantity-input");
  control.addEventListener("click", (event) => {
    const button = event.target.closest(".quantity-step");
    if (!button) return;
    const current = clampQuantity(input.value);
    const next = button.dataset.action === "increase" ? current + 1 : current - 1;
    setInputQuantity(input, next);
  });
  input?.addEventListener("change", () => setInputQuantity(input, input.value));
});

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.dataset.product;
    const controls = button.closest(".product-order-controls");
    const input = controls?.querySelector(".quantity-input");
    addProductToCart(productId, input?.value || 1);
    button.textContent = "Agregado";
    window.setTimeout(() => {
      button.textContent = "A\u00f1adir al carrito";
    }, 1200);
  });
});

cartItems?.addEventListener("click", (event) => {
  const emptyCartLink = event.target.closest(".cart-empty");
  if (emptyCartLink) {
    const productsSection = document.querySelector("#sabores");
    if (productsSection) {
      event.preventDefault();
      closeCart();
      window.requestAnimationFrame(() => {
        productsSection.scrollIntoView({
          block: "start",
          behavior: "smooth"
        });
      });
    }
    return;
  }

  const removeButton = event.target.closest(".cart-remove");
  if (removeButton) {
    removeCartItem(removeButton.dataset.product);
    return;
  }

  const stepButton = event.target.closest(".quantity-step");
  if (!stepButton) return;
  const item = stepButton.closest(".cart-item");
  const productId = item?.dataset.product;
  const current = cart.get(productId)?.quantity || 1;
  const next = stepButton.dataset.action === "increase" ? current + 1 : current - 1;
  updateCartItem(productId, next);
});

cartItems?.addEventListener("change", (event) => {
  const input = event.target.closest(".quantity-input");
  if (!input) return;
  const item = input.closest(".cart-item");
  updateCartItem(item?.dataset.product, input.value);
});

cartWhatsapp?.addEventListener("click", continueOrderOnWhatsapp);
verifyAvailabilityButton?.addEventListener("click", verifyAvailabilityOnWhatsapp);
cartForm?.addEventListener("input", updateCartWhatsappState);
cartForm?.addEventListener("change", updateCartWhatsappState);
deliveryDaySelect?.addEventListener("change", updateCartWhatsappState);
deliveryMonthSelect?.addEventListener("change", updateCartWhatsappState);
deliveryYearSelect?.addEventListener("change", updateCartWhatsappState);
fillDateOptions();
updateDeliveryDateValue();
loadSavedCart();
renderCart();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal-section").forEach((section) => revealObserver.observe(section));
