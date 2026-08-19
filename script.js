// -------------------------
// VARIABLES
// -------------------------

let products = [];

let scanningEnabled = false;

let scanTimer;


// Scanner elements

const barcodeInput =
  document.getElementById("barcodeInput");

const startButton =
  document.getElementById("startButton");

const scannerStatus =
  document.getElementById("scannerStatus");

const result =
  document.getElementById("result");


// Menu elements

const menuButton =
  document.getElementById("menuButton");

const sideMenu =
  document.getElementById("sideMenu");

const menuOverlay =
  document.getElementById("menuOverlay");

const menuItems =
  document.querySelectorAll(".menu-item");

const screens =
  document.querySelectorAll(".screen");



// -------------------------
// LOAD PRODUCTS
// -------------------------

fetch("products.json")

  .then(function(response) {

    return response.json();

  })

  .then(function(data) {

    products = data;

    console.log("Products loaded:", products);

  })

  .catch(function(error) {

    console.error(
      "Could not load products.json:",
      error
    );

    scannerStatus.innerHTML =
      "Error Loading Products";

  });



// -------------------------
// HAMBURGER MENU
// -------------------------

menuButton.addEventListener(
  "click",
  function() {

    openMenu();

  }
);



menuOverlay.addEventListener(
  "click",
  function() {

    closeMenu();

  }
);



function openMenu() {

  sideMenu.classList.add("open");

  menuOverlay.classList.add("show");

}



function closeMenu() {

  sideMenu.classList.remove("open");

  menuOverlay.classList.remove("show");

}



// -------------------------
// SWITCH SCREENS
// -------------------------

for (
  let i = 0;
  i < menuItems.length;
  i++
) {

  menuItems[i].addEventListener(
    "click",
    function() {

      const screenName =
        this.getAttribute("data-screen");


      showScreen(screenName);


      closeMenu();

    }
  );

}



function showScreen(screenName) {

  // Hide every screen

  for (
    let i = 0;
    i < screens.length;
    i++
  ) {

    screens[i].classList.remove(
      "active-screen"
    );

  }


  // Remove active menu highlight

  for (
    let i = 0;
    i < menuItems.length;
    i++
  ) {

    menuItems[i].classList.remove(
      "active"
    );

  }


  // Show selected screen

  const selectedScreen =
    document.getElementById(screenName);

  selectedScreen.classList.add(
    "active-screen"
  );


  // Highlight selected menu option

  for (
    let i = 0;
    i < menuItems.length;
    i++
  ) {

    if (
      menuItems[i].getAttribute(
        "data-screen"
      ) === screenName
    ) {

      menuItems[i].classList.add(
        "active"
      );

    }

  }


  // If returning to Product Lookup,
  // restore scanner focus.

  if (
    screenName === "lookupScreen" &&
    scanningEnabled === true
  ) {

    setTimeout(
      function() {

        barcodeInput.focus();

      },
      100
    );

  }

}



// -------------------------
// START SCANNING
// -------------------------

startButton.addEventListener(
  "click",
  function() {

    scanningEnabled = true;

    startButton.innerHTML =
      "Scanning Active";

    scannerStatus.innerHTML =
      "Scanner Ready";

    result.innerHTML = `
      <div class="ready-message">
        Ready to Scan...
      </div>
    `;

    barcodeInput.value = "";

    barcodeInput.focus();

  }
);



// -------------------------
// BARCODE INPUT
// -------------------------

barcodeInput.addEventListener(
  "input",
  function() {

    if (
      scanningEnabled === false
    ) {

      return;

    }


    clearTimeout(scanTimer);


    /*
      Tera scanner types extremely quickly.

      Wait 200ms after input stops.
      Then treat the completed text
      as one barcode.
    */

    scanTimer = setTimeout(
      function() {

        const barcode =
          barcodeInput.value.trim();


        if (
          barcode.length > 0
        ) {

          findProduct(barcode);

        }


        barcodeInput.value = "";

        barcodeInput.focus();

      },
      200
    );

  }
);



// -------------------------
// SUPPORT ENTER KEY
// -------------------------

barcodeInput.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key === "Enter"
    ) {

      clearTimeout(scanTimer);


      const barcode =
        barcodeInput.value.trim();


      if (
        barcode.length > 0
      ) {

        findProduct(barcode);

      }


      barcodeInput.value = "";

      barcodeInput.focus();

    }

  }
);



// -------------------------
// PRODUCT LOOKUP
// -------------------------

function findProduct(barcode) {

  let product = null;


  for (
    let i = 0;
    i < products.length;
    i++
  ) {

    const savedBarcode =
      products[i]
        .barcode
        .toString()
        .trim();


    if (
      savedBarcode === barcode
    ) {

      product = products[i];

      break;

    }

  }



  if (
    product !== null
  ) {

    result.innerHTML = `

      <div class="product-name">
        ${product.item}
      </div>

      <div class="location-label">
        PUT IN
      </div>

      <div class="location">
        ${product.location}
      </div>

      <div class="barcode-number">
        Barcode: ${barcode}
      </div>

    `;

  }

  else {

    result.innerHTML = `

      <div class="unknown">
        Unknown Barcode
      </div>

      <div class="barcode-number">
        ${barcode}
      </div>

    `;

  }


  // Keep scanner ready

  barcodeInput.focus();

}