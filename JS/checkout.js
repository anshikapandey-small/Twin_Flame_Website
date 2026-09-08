/* ---------- order data ----------
   Shopify note: replace this object with real cart/checkout data —
   {{ cart.items[0].product.title }}, {{ cart.items[0].final_price | money }},
   {{ cart.total_price | money }}, shipping rate from the checkout API, etc.
   The calculation + rendering logic below stays the same either way. */
const order = {
  productName: "Glimpse Tee",
  variant: "Size: S",
  quantity: 1,
  price: 5766.33,       // pre-tax item price
  shippingCost: 0,       // set to 0 for "calculated at next step" style, or a flat number
  gstRate: 0.05          // 5% GST, adjust to match your actual tax rate
};

/* ---------- label the summary product image, same image0 convention as product.html ---------- */
const summaryImg = document.getElementById('image0');
// src is already set directly in the HTML (checkout.html) — JS no longer overrides it,
// it just updates the alt text to match the current order's product name.
summaryImg.alt = order.productName;


/* ---------- fill in product info ---------- */
document.getElementById('summaryName').textContent = order.productName;
document.getElementById('summaryVariant').textContent = order.variant;
// document.getElementById('summaryQty').textContent = order.quantity;
document.getElementById('summaryPrice').textContent = formatCurrency(order.price);

/* ---------- calculate totals ---------- */
const subtotal = order.price * order.quantity;
const gstAmount = subtotal * order.gstRate;
const total = subtotal + order.shippingCost + gstAmount;

document.getElementById('subtotalValue').textContent = formatCurrency(subtotal);
document.getElementById('shippingValue').textContent =
  order.shippingCost === 0 ? "Calculated at next step" : formatCurrency(order.shippingCost);
document.getElementById('gstValue').textContent = formatCurrency(gstAmount);
document.getElementById('totalValue').textContent = formatCurrency(total);

function formatCurrency(amount) {
  return "₹" + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ---------- basic form handling ---------- */
const checkoutForm = document.getElementById('checkoutForm');
checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Shopify note: this submit will instead post to Shopify's checkout endpoint.
  // For now, this just confirms the form works end-to-end on the static page.
  alert("Order details captured. Connect this form to your payment/checkout flow next.");
});