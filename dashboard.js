(function () {
  const session = sessionStorage.getItem("pharmapilote_user");
  if (!session) {
    window.location.replace("index.html");
    return;
  }

  let user;
  try {
    user = JSON.parse(session);
  } catch {
    window.location.replace("index.html");
    return;
  }

  const roleLabels = {
    admin: "Administrateur",
    pharmacien: "Pharmacien",
    preparateur: "Préparateur",
    assistant: "Assistant",
  };

  const userName = document.getElementById("userName");
  const userRole = document.getElementById("userRole");
  const userAvatar = document.getElementById("userAvatar");

  userName.textContent = user.login || "Utilisateur";
  userRole.textContent = roleLabels[user.statut] || user.statut || "Utilisateur";
  userAvatar.textContent = (user.login || "U").charAt(0).toUpperCase();

  const app = document.getElementById("app");
  const overlay = document.getElementById("sidebarOverlay");
  const btnMenu = document.getElementById("btnMenu");

  function closeSidebar() {
    app.classList.remove("sidebar-open");
    overlay.hidden = true;
  }

  function openSidebar() {
    app.classList.add("sidebar-open");
    overlay.hidden = false;
  }

  btnMenu.addEventListener("click", function () {
    if (app.classList.contains("sidebar-open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  overlay.addEventListener("click", closeSidebar);

  function showPage(page) {
    const view = document.getElementById("view-" + page);
    if (!view) return false;

    document.querySelectorAll(".nav-item[data-page]").forEach(function (el) {
      el.classList.remove("active");
    });
    document.querySelectorAll(".nav-subitem").forEach(function (el) {
      el.classList.remove("active");
    });
    document.querySelectorAll(".nav-parent").forEach(function (el) {
      el.classList.remove("is-section-active");
    });

    document.querySelectorAll(".page-view").forEach(function (el) {
      el.classList.remove("active");
    });
    view.classList.add("active");

    const mainLink = document.querySelector('.nav-item[data-page="' + page + '"]');
    if (mainLink) {
      mainLink.classList.add("active");
    }

    const subLink = document.querySelector('.nav-subitem[data-page="' + page + '"]');
    if (subLink) {
      subLink.classList.add("active");
      const group = subLink.closest(".nav-group");
      if (group) {
        const parent = group.querySelector(".nav-parent");
        const submenu = group.querySelector(".nav-submenu");
        if (parent && submenu) {
          parent.setAttribute("aria-expanded", "true");
          parent.classList.add("is-section-active");
          submenu.hidden = false;
        }
      }
    }

    closeSidebar();
    return true;
  }

  document.querySelectorAll(".nav-item[data-page]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      showPage(link.getAttribute("data-page"));
    });
  });

  document.querySelectorAll(".nav-parent").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const group = btn.closest(".nav-group");
      const submenu = group ? group.querySelector(".nav-submenu") : null;
      if (!submenu) return;
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      submenu.hidden = open;
    });
  });

  document.querySelectorAll(".nav-subitem").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      showPage(link.getAttribute("data-page"));
    });
  });

  document.getElementById("btnLogout").addEventListener("click", function () {
    sessionStorage.removeItem("pharmapilote_user");
    window.location.replace("index.html");
  });

  /* ——— Alerte Stock ——— */
  const btnAlertStock = document.getElementById("btnAlertStock");
  const alertsPanel = document.getElementById("alertsPanel");
  const btnCloseAlerts = document.getElementById("btnCloseAlerts");

  function refreshAlertCounts() {
    const items = document.querySelectorAll("#alertList li[data-level]");
    const low = document.querySelectorAll('#alertList li[data-level="low"]').length;
    const out = document.querySelectorAll('#alertList li[data-level="out"]').length;
    const total = items.length;
    const countEl = document.getElementById("alertStockCount");
    const lowEl = document.getElementById("alertLowCount");
    const outEl = document.getElementById("alertOutCount");
    if (countEl) countEl.textContent = String(total);
    if (lowEl) lowEl.textContent = String(low);
    if (outEl) outEl.textContent = String(out);
  }

  function openAlerts() {
    alertsPanel.hidden = false;
    btnAlertStock.classList.add("is-open");
  }

  function closeAlerts() {
    alertsPanel.hidden = true;
    btnAlertStock.classList.remove("is-open");
  }

  btnAlertStock.addEventListener("click", function () {
    if (alertsPanel.hidden) {
      openAlerts();
    } else {
      closeAlerts();
    }
  });

  btnCloseAlerts.addEventListener("click", closeAlerts);
  refreshAlertCounts();

  /* ——— Caisse / Calculatrice ——— */
  const catalog = [
    { barcode: "3400930000001", name: "Paracétamol 1g", price: 2.5 },
    { barcode: "3400930000002", name: "Ibuprofène 400mg", price: 3.2 },
    { barcode: "3400930000003", name: "Amoxicilline 500mg", price: 8.9 },
    { barcode: "3400930000004", name: "Vitamine D3", price: 6.4 },
    { barcode: "3400930000005", name: "Aspirine 500mg", price: 2.1 },
    { barcode: "3400930000006", name: "Sirop Toux Adulte", price: 5.8 },
  ];

  const productSearch = document.getElementById("productSearch");
  const productAmount = document.getElementById("productAmount");
  const barcodeHint = document.getElementById("barcodeHint");
  const caisseCart = document.getElementById("caisseCart");
  const caisseTotal = document.getElementById("caisseTotal");
  const caissePay = document.getElementById("caissePay");
  const payPanelTotal = document.getElementById("payPanelTotal");
  const patientName = document.getElementById("patientName");
  const patientCin = document.getElementById("patientCin");
  const btnClosePay = document.getElementById("btnClosePay");
  const payModalBackdrop = document.getElementById("payModalBackdrop");
  const btnAddProduct = document.getElementById("btnAddProduct");
  const btnValidateOrder = document.getElementById("btnValidateOrder");
  const btnPreviewOrder = document.getElementById("btnPreviewOrder");
  const btnConfirmPay = document.getElementById("btnConfirmPay");
  const orderModal = document.getElementById("orderModal");
  const btnPreviewBack = document.getElementById("btnPreviewBack");
  const btnPreviewValidate = document.getElementById("btnPreviewValidate");
  const previewTableBody = document.getElementById("previewTableBody");
  const previewTotal = document.getElementById("previewTotal");
  const previewDate = document.getElementById("previewDate");
  const previewTicketRef = document.getElementById("previewTicketRef");
  const ticketRef = document.getElementById("ticketRef");

  let cart = [];
  let selectedPay = null;
  let orderValidated = false;
  let resolvedProduct = null;

  function formatAmount(n) {
    return Number(n).toFixed(2);
  }

  function findProduct(query) {
    const q = String(query || "").trim().toLowerCase();
    if (!q) return null;

    const byBarcode = catalog.find(function (p) {
      return p.barcode === q || p.barcode.toLowerCase() === q;
    });
    if (byBarcode) return byBarcode;

    const byNameExact = catalog.find(function (p) {
      return p.name.toLowerCase() === q;
    });
    if (byNameExact) return byNameExact;

    return catalog.find(function (p) {
      return p.name.toLowerCase().includes(q) || p.barcode.includes(q);
    }) || null;
  }

  function applyProduct(product, fromBarcode) {
    resolvedProduct = product;
    productSearch.value = product.name;
    productAmount.value = product.price.toFixed(2);
    if (barcodeHint) {
      barcodeHint.textContent = fromBarcode
        ? "Code-barres " + product.barcode + " → " + product.name
        : "Produit sélectionné · " + product.barcode;
      barcodeHint.classList.remove("is-error");
      barcodeHint.classList.add("is-ok");
    }
  }

  function clearProductFeedback() {
    resolvedProduct = null;
    if (barcodeHint) {
      barcodeHint.textContent = "Scannez ou saisissez un code-barres · Entrée pour valider";
      barcodeHint.classList.remove("is-ok", "is-error");
    }
  }

  function addResolvedProduct() {
    const query = productSearch.value.trim();
    const product = resolvedProduct || findProduct(query);
    let name;
    let amount;

    if (product) {
      name = product.name;
      amount = parseFloat(productAmount.value) || product.price;
    } else {
      name = query;
      amount = parseFloat(String(productAmount.value).replace(",", "."));
    }

    if (!name) {
      productSearch.focus();
      return false;
    }
    if (isNaN(amount) || amount <= 0) {
      productAmount.focus();
      return false;
    }

    cart.push({
      name: name,
      price: amount,
      barcode: product ? product.barcode : "",
    });
    productSearch.value = "";
    productAmount.value = "";
    clearProductFeedback();
    closePayPanel();
    renderCart();
    productSearch.focus();
    return true;
  }

  function openPreview() {
    if (cart.length === 0) return;

    previewTableBody.innerHTML = "";
    cart.forEach(function (item, index) {
      const tr = document.createElement("tr");
      tr.innerHTML = "<td></td><td></td><td>1</td><td></td>";
      tr.children[0].textContent = String(index + 1);
      tr.children[1].textContent = item.barcode
        ? item.name + " (" + item.barcode + ")"
        : item.name;
      tr.children[3].textContent = formatAmount(item.price);
      previewTableBody.appendChild(tr);
    });

    const total = cart.reduce(function (sum, item) {
      return sum + item.price;
    }, 0);
    previewTotal.textContent = formatAmount(total);
    previewTicketRef.textContent = ticketRef ? ticketRef.textContent : "#T-00482";

    const now = new Date();
    previewDate.textContent = now.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    orderModal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closePreview() {
    orderModal.hidden = true;
    document.body.style.overflow = "";
  }

  function resetPatientFields() {
    if (patientName) patientName.value = "";
    if (patientCin) patientCin.value = "";
  }

  function closePayPanel() {
    orderValidated = false;
    caissePay.hidden = true;
    selectedPay = null;
    btnConfirmPay.disabled = true;
    resetPatientFields();
    document.querySelectorAll(".pay-type").forEach(function (btn) {
      btn.classList.remove("selected");
    });
    document.body.style.overflow = "";
  }

  function validateOrder() {
    if (cart.length === 0) return;
    orderValidated = true;
    const total = cart.reduce(function (sum, item) {
      return sum + item.price;
    }, 0);
    if (payPanelTotal) {
      payPanelTotal.textContent = formatAmount(total);
    }
    selectedPay = null;
    btnConfirmPay.disabled = true;
    resetPatientFields();
    document.querySelectorAll(".pay-type").forEach(function (btn) {
      btn.classList.remove("selected");
    });
    caissePay.hidden = false;
    document.body.style.overflow = "hidden";
    if (patientName) patientName.focus();
  }

  function updateTotal() {
    const total = cart.reduce(function (sum, item) {
      return sum + item.price;
    }, 0);
    caisseTotal.textContent = formatAmount(total);
    const display = document.getElementById("caisseDisplay");
    if (display) {
      display.classList.remove("flash");
      void display.offsetWidth;
      display.classList.add("flash");
      setTimeout(function () {
        display.classList.remove("flash");
      }, 280);
    }
    const empty = cart.length === 0;
    btnValidateOrder.disabled = empty;
    btnPreviewOrder.disabled = empty;
    updateCartCount();
    if (empty) {
      closePayPanel();
    }
  }

  function updateCartCount() {
    const el = document.getElementById("cartCount");
    if (!el) return;
    const n = cart.length;
    el.textContent = n + (n > 1 ? " articles" : " article");
  }

  function renderCart() {
    caisseCart.innerHTML = "";
    cart.forEach(function (item, index) {
      const li = document.createElement("li");
      li.innerHTML =
        '<div class="cart-info"><span class="cart-name"></span><span class="cart-barcode"></span></div><span class="cart-price"></span><button type="button" class="cart-remove" aria-label="Retirer">×</button>';
      li.querySelector(".cart-name").textContent = item.name;
      const barcodeEl = li.querySelector(".cart-barcode");
      if (item.barcode) {
        barcodeEl.textContent = item.barcode;
      } else {
        barcodeEl.remove();
      }
      li.querySelector(".cart-price").textContent = formatAmount(item.price);
      li.querySelector(".cart-remove").addEventListener("click", function () {
        cart.splice(index, 1);
        closePayPanel();
        renderCart();
        updateTotal();
      });
      caisseCart.appendChild(li);
    });
    updateTotal();
  }

  productSearch.addEventListener("input", function () {
    const query = productSearch.value.trim();
    if (!query) {
      clearProductFeedback();
      return;
    }
    const product = findProduct(query);
    if (product) {
      const isBarcode = /^\d{8,14}$/.test(query) || query === product.barcode;
      if (isBarcode || query.toLowerCase() === product.name.toLowerCase()) {
        applyProduct(product, isBarcode);
      } else {
        resolvedProduct = product;
      }
    } else if (/^\d{8,14}$/.test(query)) {
      resolvedProduct = null;
      if (barcodeHint) {
        barcodeHint.textContent = "Code-barres inconnu";
        barcodeHint.classList.add("is-error");
        barcodeHint.classList.remove("is-ok");
      }
    }
  });

  productSearch.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const query = productSearch.value.trim();
    const product = findProduct(query);
    if (product) {
      applyProduct(product, /^\d+$/.test(query) || query === product.barcode);
      // Scan code-barres : ajout direct au ticket
      if (/^\d{8,14}$/.test(query) || query === product.barcode) {
        productAmount.value = product.price.toFixed(2);
        addResolvedProduct();
      }
    } else if (query) {
      if (barcodeHint) {
        barcodeHint.textContent = "Produit introuvable";
        barcodeHint.classList.add("is-error");
        barcodeHint.classList.remove("is-ok");
      }
    }
  });

  productSearch.addEventListener("change", function () {
    const product = findProduct(productSearch.value);
    if (product) {
      applyProduct(product, false);
    }
  });

  btnAddProduct.addEventListener("click", function () {
    addResolvedProduct();
  });

  btnPreviewOrder.addEventListener("click", openPreview);
  btnPreviewBack.addEventListener("click", closePreview);
  document.getElementById("orderModalBackdrop").addEventListener("click", closePreview);

  btnPreviewValidate.addEventListener("click", function () {
    closePreview();
    validateOrder();
  });

  btnValidateOrder.addEventListener("click", function () {
    validateOrder();
  });

  btnClosePay.addEventListener("click", closePayPanel);
  payModalBackdrop.addEventListener("click", closePayPanel);

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!orderModal.hidden) {
      closePreview();
    } else if (!caissePay.hidden) {
      closePayPanel();
    }
  });

  document.querySelectorAll(".pay-type").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!orderValidated || caissePay.hidden) return;
      document.querySelectorAll(".pay-type").forEach(function (el) {
        el.classList.remove("selected");
      });
      btn.classList.add("selected");
      selectedPay = btn.getAttribute("data-pay");
      btnConfirmPay.disabled = false;
    });
  });

  btnConfirmPay.addEventListener("click", function () {
    if (!orderValidated || !selectedPay || cart.length === 0) return;
    const labels = {
      especes: "Espèces",
      carte: "Carte bancaire",
      cheque: "Chèque",
      tiers: "Tiers payant",
      mobile: "Paiement mobile",
    };
    const total = cart.reduce(function (sum, item) {
      return sum + item.price;
    }, 0);
    const name = patientName ? patientName.value.trim() : "";
    const cin = patientCin ? patientCin.value.trim() : "";
    let message =
      "Paiement confirmé\nTotal : " +
      formatAmount(total) +
      "\nMode : " +
      (labels[selectedPay] || selectedPay);
    if (name) message += "\nPatient : " + name;
    if (cin) message += "\nCIN : " + cin;
    alert(message);
    cart = [];
    closePayPanel();
    renderCart();
  });

  updateTotal();
})();
