/* eslint-disable */
(($) => {
  "use strict";

  // Sınıf adları
  const classes = {
    style: "custom-style",
    wrapper: "custom-wrapper",
    container: "custom-container",
    productCard: "product-card",
    addToCartButton: "add-to-cart-btn",
    viewDetailButton: "view-detail-btn",
    cartModal: "cart-modal",
    detailModal: "detail-modal",
    overlay: "overlay",
    popupMessage: "popup-message",
    spinner: "spinner",
    searchInput: "search-input",
    viewCartBtn: "view-cart-btn",
    removeItem: "remove-item",
    clearCartBtn: "clear-cart-btn",
    closeDetail: "close-detail",
  };

  // Seçiciler
  const selectors = {
    style: `.${classes.style}`,
    wrapper: `.${classes.wrapper}`,
    container: `.${classes.container}`,
    productCard: `.${classes.productCard}`,
    addToCartButton: `.${classes.addToCartButton}`,
    viewDetailButton: `.${classes.viewDetailButton}`,
    cartModal: `#${classes.cartModal}`,
    detailModal: `#${classes.detailModal}`,
    overlay: `#${classes.overlay}`,
    popupMessage: `.${classes.popupMessage}`,
    spinner: `.${classes.spinner}`,
    searchInput: `#${classes.searchInput}`,
    viewCartBtn: `#${classes.viewCartBtn}`,
    removeItem: `.${classes.removeItem}`,
    clearCartBtn: `#${classes.clearCartBtn}`,
    closeDetail: `#${classes.closeDetail}`,
    productList: "#productList",
    searchBar: "#searchBar",
    appendLocation: "body", // HTML buraya eklenecek
  };

  const self = {
    products: [],
    cart: [],
  };

  // Başlatıcı
  self.init = async () => {
    self.reset();
    self.buildCSS();
    self.buildHTML();
    await self.fetchProducts();
    self.renderProducts();
    self.setEvents();
  };

  // Önceki öğeleri temizler
  self.reset = () => {
    $(selectors.style).remove();
    $(selectors.wrapper).remove();
    $(document).off(".eventListener");
  };

  // CSS stillerini ekler
  self.buildCSS = () => {
    const customStyle = `<style class="${classes.style}">
        :root {
          --mainBodyColor1: #a6c1ee;
          --mainBodyColor2: #fbc2eb;
          --card-bg: #fff;
          --button-bg: #007bff;
          --button-color: #fff;
          --card-hover-shadow: 0 4px 12px rgba(0, 0, 255, 0.9);
          --popup-message-bg: #FF0000;
        }
        body {
          background: linear-gradient(135deg, var(--mainBodyColor1), var(--mainBodyColor2));
          font-family: Arial, sans-serif;
          padding: 20px;
          color:#722F37;
        }
        h1 {
          text-align: center;
          margin-bottom: 20px;
        }
        ${selectors.searchBar} {
          text-align: center;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          gap: 20px;
        }
        .input-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        ${selectors.searchInput} {
          padding: 8px;
          width: 250px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .icon {
          font-size: 20px;
        }
        ${selectors.viewCartBtn} {
          font-size: 16px;
          cursor: pointer;
          background: var(--button-bg);
          color: var(--button-color);
          border: none;
          border-radius: 5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        ${selectors.productList} {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
        }
        ${selectors.productCard} {
          background: var(--card-bg);
          border: 1px solid #ccc;
          border-radius: 8px;
          width: 200px;
          padding: 10px;
          text-align: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          transition: box-shadow 0.3s;
        }
        ${selectors.productCard}:hover {
          box-shadow: var(--card-hover-shadow);
          transform: scale(1.05);
        }
        ${selectors.productCard} img {
          width: 100%;
          height: 180px;
          object-fit: contain;
        }
        button {
          background: var(--button-bg);
          color: var(--button-color);
          border: none;
          padding: 8px 12px;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 8px;
          margin-right: 5px;
        }
        button:hover {
          background: darkblue;
          transform: scale(1.05);
        }
        ${selectors.cartModal} {
          display: none;
          position: fixed;
          top: 100px;
          right: 50px;
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0,0,0,0.2);
          width: 300px;
          max-height: 400px;
          overflow-y: auto;
          z-index: 9999;
        }
        .cart-item-modal {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
        }
        .cart-item-modal img {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }
        ${selectors.removeItem} {
          background: red;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 5px;
          cursor: pointer;
        }
        #totalPrice {
          margin-top: 10px;
          font-weight: bold;
          text-align: right;
        }
        ${selectors.overlay} {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.1);
          z-index: 9998;
        }
        ${selectors.popupMessage} {
          position: fixed;
          top: 20px;
          right: 20px;
          background: var(--popup-message-bg);
          color: #fff;
          padding: 10px 20px;
          border-radius: 5px;
          z-index: 99999;
          opacity: 0;
        }
        ${selectors.spinner} {
          width: 40px;
          height: 40px;
          margin: 20px auto;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #3498db;
          border-radius: 50%;
          animation: rotate 1s linear infinite;
        }
        @keyframes rotate {
          0% { transform: rotate(0); }
          100% { transform: rotate(360deg); }
        }
        ${selectors.detailModal} {
          display: none;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0,0,0,0.3);
          z-index: 10000;
          width: 300px;
        }
      </style>`;
    $("head").append(customStyle);
  };

  // HTML yapısını oluşturur
  self.buildHTML = () => {
    const html = `<h1>🛒 Mini E-Commercial</h1>
      <div id="searchBar">
        <div class="input-group">
          <span class="icon">🔍</span>
          <input type="text" id="${classes.searchInput}" placeholder="Search a product..." />
        </div>
        <button id="${classes.viewCartBtn}"><span class="icon">🧺</span>Products added to Cart</button>
      </div>
      <div id="productList"></div>
      <div id="${classes.overlay}"></div>
      <div id="${classes.cartModal}"></div>
      <div id="${classes.overlay}"></div>
      <div id="${classes.detailModal}"></div>`;
    $(selectors.appendLocation).append(html);
  };

  // Ürünleri API'den çeker
  self.fetchProducts = async () => {
    $(selectors.productList).append(`<div class="${classes.spinner}"></div>`);
    const data = await $.getJSON("https://fakestoreapi.com/products");
    $(selectors.spinner).hide();
    self.products = data;
    self.cart = JSON.parse(localStorage.getItem("cart")) || [];
  };

  // Ürünleri filtreleyip sayfada görüntüleyen fonksiyon
  self.renderProducts = (filter = "") => {
    $(selectors.productList).empty();

    const filtered = self.products.filter((product) =>
      product.title.toLowerCase().includes(filter.toLowerCase())
    );

    if (filtered.length === 0) {
      $(selectors.productList).append("<p>Product not found.</p>");
      return;
    }

    filtered.forEach((product) => {
      const card = `<div class="${classes.productCard}" data-id="${
        product.id
      }" data-title="${product.title.toLowerCase()}">
          <img src="${product.image}" alt="${product.title}">
          <h4>${product.title.slice(0, 35)}...</h4>
          <p><b>$${product.price}</b></p>
          <button class="${classes.addToCartButton}">Add to Cart</button>
          <button class="${classes.viewDetailButton}">Detail</button>
        </div>`;
      $(selectors.productList).append(card);
    });
  };

  // Sepet modalını render eder
  self.renderCartModal = () => {
    const modal = $(selectors.cartModal);
    modal.empty();

    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    if (saved.length === 0) {
      modal.append("<p>Product not found.</p>");
    } else {
      saved.forEach(({ id, quantity }) => {
        const product = self.products.find((p) => p.id === id);
        if (product) {
          const subtotal = product.price * quantity;
          total += subtotal;

          modal.append(
            `<div class="cart-item-modal" data-id="${product.id}">
              <img src="${product.image}">
              <span>${quantity}x ${product.title.slice(0, 15)}...</span>
              <span>$${subtotal.toFixed(2)}</span>
              <button class="${classes.removeItem}">Delete</button>
            </div>`
          );
        }
      });

      modal.append(`<div id="totalPrice">Toplam: $${total.toFixed(2)}</div>`);
      modal.append(`<button id="${classes.clearCartBtn}">Clear Cart</button>`);
    }
  };

  // Olay dinleyicilerini kurar
  self.setEvents = () => {
    $(document).on("input.eventListener", selectors.searchInput, function () {
      const query = $(this).val();
      self.renderProducts(query);
    });

    $(document).on(
      "click.eventListener",
      selectors.addToCartButton,
      function () {
        const id = $(this).closest(selectors.productCard).data("id");
        const existing = self.cart.find((item) => item.id === id);

        if (existing) {
          existing.quantity++;
        } else {
          self.cart.push({ id: id, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(self.cart));

        const popup = $(
          `<div class="${classes.popupMessage}">Product added to cart</div>`
        ).appendTo("body");
        popup.animate({ opacity: 1 }, 300);
        setTimeout(() => {
          popup.fadeOut(300, () => popup.remove());
        }, 1500);
      }
    );

    $(document).on(
      "click.eventListener",
      selectors.viewDetailButton,
      function () {
        const id = $(this).closest(selectors.productCard).data("id");
        const product = self.products.find((p) => p.id === id);

        if (product) {
          $(selectors.detailModal).html(
            `<h3>${product.title}</h3>
          <img src="${product.image}" style="width:100%; max-height:150px; object-fit:contain">
          <p>${product.description}</p>
          <p><b>Price: $${product.price}</b></p>
          <button id="${classes.closeDetail}">Close</button>`
          );

          $(selectors.overlay).fadeIn();
          $(selectors.detailModal).fadeIn();
        }
      }
    );

    $(document).on("click.eventListener", selectors.closeDetail, function () {
      $(selectors.overlay).fadeOut();
      $(selectors.detailModal).fadeOut();
    });

    $(document).on("click.eventListener", selectors.viewCartBtn, function () {
      self.renderCartModal();
      $(selectors.overlay).fadeIn();
      $(selectors.cartModal).fadeIn();
    });

    $(document).on("click.eventListener", selectors.overlay, function () {
      $(selectors.cartModal).fadeOut();
      $(selectors.overlay).fadeOut();
    });

    $(document).on("click.eventListener", selectors.removeItem, function (e) {
      e.stopPropagation();
      const id = $(this).closest(".cart-item-modal").data("id");
      const index = self.cart.findIndex((item) => item.id === id);

      if (index > -1) {
        self.cart[index].quantity--;
        if (self.cart[index].quantity <= 0) {
          self.cart.splice(index, 1);
        }
        localStorage.setItem("cart", JSON.stringify(self.cart));
      }
      self.renderCartModal();
    });

    $(document).on("click.eventListener", selectors.clearCartBtn, function () {
      self.cart = [];
      localStorage.removeItem("cart");
      self.renderCartModal();
    });
  };

  // Sayfa yüklendiğinde başlat
  $(document).ready(self.init);
})(jQuery);
