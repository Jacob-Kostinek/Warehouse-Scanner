let products = [];

fetch("products.json")
  .then(response => response.json())
  .then(data => {
    products = data;
  });

const barcodeInput = document.getElementById("barcodeInput");
const result = document.getElementById("result");

barcodeInput.focus();

document.addEventListener("click", function () {
  barcodeInput.focus();
});

barcodeInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const barcode = barcodeInput.value.trim();

    findProduct(barcode);

    barcodeInput.value = "";
    barcodeInput.focus();
  }
});

function findProduct(barcode) {
  const product = products.find(p => p.barcode === barcode);

  if (product) {
    result.innerHTML = `
      <h2>${product.item}</h2>

      <p>PUT IN:</p>

      <h1>${product.location}</h1>
    `;
  } else {
    result.innerHTML = `
      <h2>Unknown Barcode</h2>

      <p>${barcode}</p>
    `;
  }
}