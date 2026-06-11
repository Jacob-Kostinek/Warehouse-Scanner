let products = [];

fetch("products.json")
  .then(response => response.json())
  .then(data => {
    products = data;
  });

function onScanSuccess(barcode) {
  let product = products.find(p => p.barcode === barcode);

  let result = document.getElementById("result");

  if (product) {
    result.innerHTML = `
      Item: ${product.item}<br>
      Location: ${product.location}
    `;
  } else {
    result.innerHTML = `
      Unknown barcode:<br>
      ${barcode}
    `;
  }
}

let scanner = new Html5QrcodeScanner(
  "reader",
  { fps: 10, qrbox: 250 }
);

scanner.render(onScanSuccess);