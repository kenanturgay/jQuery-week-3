const task = (async ($) => {
  let products = [];
  let cart = [];

  // Sayfa yapısını oluştur
  const buildHTML = () => {
    $("body").html(`
      <style>
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
        #searchBar {
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
        #searchInput {
          padding: 8px;
          width: 250px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .icon {
          font-size: 20px;
        }
        #viewCartBtn {
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
        #productList {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
        }
        .product-card {
          background: var(--card-bg);
          border: 1px solid #ccc;
          border-radius: 8px;
          width: 200px;
          padding: 10px;
          text-align: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          transition: box-shadow 0.3s;
        }
        .product-card:hover {
          box-shadow: var(--card-hover-shadow);
          transform: scale(1.05);
        }
        .product-card img {
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
        #cartModal {
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
        .remove-item {
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
        #cartOverlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.1);
          z-index: 9998;
        }
        .popup-message {
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
        .spinner {
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
        #detailModal {
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
        #detailOverlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          z-index: 9999;
        }
      </style>
      <h1>🛒 Mini E-Commercial</h1>
      <div id="searchBar">
        <div class="input-group">
          <span class="icon">🔍</span>
          <input type="text" id="searchInput" placeholder="Search a product..." />
        </div>
        <button id="viewCartBtn"><span class="icon">🧺</span>Products added to Cart</button>
      </div>
      <div id="productList"></div>
      <div id="cartOverlay"></div>
      <div id="cartModal"></div>
      <div id="detailOverlay"></div>
      <div id="detailModal"></div>
    `);
  };

  // Ürünleri filtreleyip sayfada görüntüleyen fonksiyon
  const renderProducts = (filter = "") => {
    // Önceki ürün kartlarını temizle
    $("#productList").empty();

    // Ürünleri filtrele: başlık, filtre metnini içeriyorsa eşleşir
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(filter)
    );

    // Filtreleme sonucu ürün bulunamazsa kullanıcıya mesaj göster
    if (filtered.length === 0) {
      $("#productList").append("<p>Product not found.</p>");
      return; // Fonksiyondan çık
    }

    // Filtrelenen her ürün için kart oluştur
    filtered.forEach((product) => {
      const card = $(`
      <div class="product-card" data-id="${
        product.id
      }" data-title="${product.title.toLowerCase()}">
        <img src="${product.image}" alt="${product.title}">
        <h4>${product.title.slice(
          0,
          35
        )}...</h4> <!-- Uzun başlıklar kısaltılıyor -->
        <p><b>$${product.price}</b></p>
        <button class="addToCart">Add to Cart</button> <!-- Sepete ekle butonu -->
        <button class="viewDetail">Detail</button>     <!-- Ürün detayını gösteren buton -->
      </div>
    `);

      // Oluşturulan kartı ürün listesine ekle
      $("#productList").append(card);
    });
  };

  const renderCartModal = () => {
    // Sepet modali için jQuery seçiciyle modal elementini alıyoruz
    const modal = $("#cartModal");
    // Modal içeriğini temizliyoruz ki eski ürünler kalmasın
    modal.empty();

    // LocalStorage'dan kaydedilmiş sepet verisini alıyoruz
    // Eğer yoksa boş dizi olarak başlatıyoruz
    const saved = JSON.parse(localStorage.getItem("cart")) || [];

    // Sepetin toplam fiyatını tutacak değişken
    let total = 0;

    // Eğer sepet boşsa kullanıcıya ürün bulunamadığını gösteriyoruz
    if (saved.length === 0) {
      modal.append("<p>Product not found.</p>");
    } else {
      // Sepetteki her ürün için işlemler
      saved.forEach(({ id, quantity }) => {
        // Ürünü ürünler listesinden ID ile buluyoruz
        const product = products.find((p) => p.id === id);

        // Ürün bulunursa devam ediyoruz
        if (product) {
          // Ürün fiyatı ile adet çarpılarak ara toplam bulunur
          const subtotal = product.price * quantity;
          // Ara toplam toplam fiyata eklenir
          total += subtotal;

          // Modal içine sepetteki ürünü gösteren HTML eklenir
          modal.append(`
          <div class="cart-item-modal" data-id="${product.id}">
            <img src="${product.image}">  <!-- Ürün resmi -->
            <span>${quantity}x ${product.title.slice(
            0,
            15
          )}...</span>  <!-- Ürün adı ve adet -->
            <span>$${subtotal.toFixed(
              2
            )}</span>  <!-- Ürün ara toplam fiyatı -->
            <button class="remove-item">Delete</button>  <!-- Ürünü sepetten çıkarma butonu -->
          </div>
        `);
        }
      });

      // Tüm ürünlerin toplam fiyatını gösteriyoruz
      modal.append(`<div id="totalPrice">Toplam: $${total.toFixed(2)}</div>`);

      // Sepeti tamamen temizlemek için bir buton ekliyoruz
      modal.append(`<button id="clearCartBtn">Clear Cart</button>`);
    }
  };

  const setEvents = () => {
    // Arama inputuna her yazı girişinde ürünleri filtrele ve göster
    $("#searchInput").on("input", function () {
      const query = $(this).val().toLowerCase();
      renderProducts(query);
    });

    // Ürün listesinde "Add to Cart" butonuna tıklanınca sepet işlemi
    $("#productList").on("click", ".addToCart", function () {
      // Tıklanan ürünün ID'sini al
      const id = $(this).closest(".product-card").data("id");

      // Sepette bu ürün varsa miktarını artır
      const existing = cart.find((item) => item.id === id);
      if (existing) {
        existing.quantity++;
      } else {
        // Yoksa sepete yeni ürün olarak ekle
        cart.push({ id: id, quantity: 1 });
      }

      // Güncel sepeti localStorage'a kaydet
      localStorage.setItem("cart", JSON.stringify(cart));

      // Sepete eklendi bilgisini gösteren popup oluştur ve göster
      const popup = $(
        '<div class="popup-message">Product added to cart</div>'
      ).appendTo("body");
      popup.animate({ opacity: 1 }, 300);
      setTimeout(() => {
        popup.fadeOut(300, () => popup.remove());
      }, 1500);
    });

    // Ürün listesinde "Detail" butonuna tıklanınca detay modalını aç
    $("#productList").on("click", ".viewDetail", function () {
      // Tıklanan ürünün ID'sini al
      const id = $(this).closest(".product-card").data("id");

      // ID ile ürün bilgisini bul
      const product = products.find((p) => p.id === id);

      if (product) {
        // Detay modalına ürün bilgilerini yaz
        $("#detailModal").html(`
        <h3>${product.title}</h3>
        <img src="${product.image}" style="width:100%; max-height:150px; object-fit:contain">
        <p>${product.description}</p>
        <p><b>Price: $${product.price}</b></p>
        <button id="closeDetail">Close</button>
      `);

        // Detay modalını ve overlayi göster (görünür yap)
        $("#detailOverlay").fadeIn();
        $("#detailModal").fadeIn();
      }
    });

    // Detay modalındaki "Close" butonuna tıklanınca modalı kapat
    $("body").on("click", "#closeDetail", function () {
      $("#detailOverlay").fadeOut();
      $("#detailModal").fadeOut();
    });

    // Sepet görüntüle butonuna tıklanınca sepet modalını aç
    $("#viewCartBtn").on("click", function () {
      renderCartModal();
      $("#cartOverlay").fadeIn();
      $("#cartModal").fadeIn();
    });

    // Sepet overlayine tıklanınca modalı kapat
    $("#cartOverlay").on("click", function () {
      $("#cartModal").fadeOut();
      $("#cartOverlay").fadeOut();
    });

    // Sepet modalındaki "Delete" butonuna tıklanınca ilgili ürünü azalt veya çıkar
    $("#cartModal").on("click", ".remove-item", function (e) {
      e.stopPropagation(); // Tıklamanın modal dışına yayılmasını engelle

      // Tıklanan ürünün ID'sini al
      const id = $(this).closest(".cart-item-modal").data("id");

      // Sepetteki ürünün indexini bul
      const index = cart.findIndex((item) => item.id === id);

      if (index > -1) {
        // Ürün miktarını 1 azalt
        cart[index].quantity--;

        // Miktar 0 veya daha azsa ürünü tamamen çıkar
        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }

        // Güncel sepeti localStorage'a kaydet
        localStorage.setItem("cart", JSON.stringify(cart));
      }

      // Sepet modalını güncelle
      renderCartModal();
    });

    // Sepet temizle butonuna tıklanınca sepeti tamamen boşalt
    $("#cartModal").on("click", "#clearCartBtn", function () {
      cart = [];
      localStorage.removeItem("cart");
      renderCartModal();
    });
  };
  const init = async () => {
    // Sayfa yapısını oluştur (HTML + CSS)
    buildHTML();

    // Ürün listesinin içine yükleniyor göstergesi (spinner) ekle
    $("#productList").append('<div class="spinner"></div>');

    // FakeStore API'den ürün verilerini JSON olarak çek (async await ile)
    const data = await $.getJSON("https://fakestoreapi.com/products");

    // Yüklenme tamamlandı, spinner'ı gizle
    $(".spinner").hide();

    // Çekilen ürünleri products dizisine ekle
    products.push(...data);

    // Daha önce localStorage'da kaydedilmiş sepeti getir veya boş dizi ata
    cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Ürünleri sayfada göster (render et)
    renderProducts();

    // Tüm buton, input gibi elementlere event (olay) dinleyicileri ekle
    setEvents();
  };

  // Sayfa yüklendiğinde init fonksiyonunu çalıştır
  await init();
})(jQuery);
