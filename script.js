let products = [];

let scanningEnabled = false;

let scanTimer;


const barcodeInput = document.getElementById("barcodeInput");

const result = document.getElementById("result");

const startButton = document.getElementById("startButton");

const status = document.getElementById("status");



fetch("products.json")
  .then(response => response.json())
  .then(data => {

    products = data;

    console.log("Products loaded:", products);

  })
  .catch(error => {

    console.error("Error loading products:", error);

  });



startButton.addEventListener("click", function () {

  scanningEnabled = true;

  barcodeInput.focus();

  status.innerHTML = "Scanner Ready";

  startButton.innerHTML = "Scanning Active";

  result.innerHTML = `
    <div class="ready">
      Ready to Scan...
    </div>
  `;

});



barcodeInput.addEventListener("input", function () {

  if (scanningEnabled === false) {
    return;
  }


  clearTimeout(scanTimer);


  scanTimer = setTimeout(function () {

    let barcode = barcodeInput.value.trim();


    if (barcode.length > 0) {

      findProduct(barcode);

      barcodeInput.value = "";

      barcodeInput.focus();

    }

  }, 150);

});



barcodeInput.addEventListener("keydown", function (event) {

  if (event.key === "Enter") {

    clearTimeout(scanTimer);


    let barcode = barcodeInput.value.trim();


    if (barcode.length > 0) {

      findProduct(barcode);

    }


    barcodeInput.value = "";

    barcodeInput.focus();

  }

});



function findProduct(barcode) {

  let product = products.find(function (p) {

    return p.barcode.toString().trim() === barcode;

  });



  if (product) {

    result.innerHTML = `

      <h2>${product.item}</h2>

      <p>PUT IN:</p>

      <h1>${product.location}</h1>

      <p>Barcode: ${barcode}</p>

    `;

  }

  else {

    result.innerHTML = `

      <h2>Unknown Barcode</h2>

      <p>${barcode}</p>

    `;

  }


  barcodeInput.focus();

}