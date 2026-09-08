console.log("product.js loaded");
/* ==========================================================================
   IMAGE SOURCE CONFIG
   ==========================================================================
   1. Put your product images in one folder, named in sequence:
      image0.jpg, image1.jpg, image2.jpg, image3.jpg ...
      (any of the extensions listed in IMAGE_EXTENSIONS below is fine,
      and you can mix extensions across images if needed)
   2. Set IMAGE_FOLDER_PATH to that folder, relative to this HTML file.
   3. That's it — JS below checks image0, image1, image2... in order and
      stops as soon as one doesn't exist, so the gallery always matches
      however many images are actually in the folder.

   Shopify note: when converting to Liquid, skip this whole auto-detect
   block and instead build the array directly from Shopify's own data:
   const productImages = [{% for image in product.images %}"{{ image | image_url: width: 1200 }}",{% endfor %}];
   Shopify already knows exactly which images exist, so there's nothing
   to "detect" at that point — this trick is only needed for a plain
   static folder with no backend behind it.
   ========================================================================== */
const IMAGE_FOLDER_PATH = "../media/product/figurines/kokoshibo/"; // <-- change this to your folder
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const MAX_IMAGES_TO_CHECK = 20; // safety cap so it doesn't loop forever

/* checks whether a single image URL actually loads */
function imageExists(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

/* for a given index, tries each extension until one is found;
   returns the working URL, or null if none of the extensions exist */
async function findImageForIndex(index) {
  for (const ext of IMAGE_EXTENSIONS) {
    const candidate = `${IMAGE_FOLDER_PATH}image${index}.${ext}`;
    if (await imageExists(candidate)) return candidate;
  }
  return null;
}

/* builds the full list by checking image0, image1, image2... in order,
   stopping the first time an index has no matching file */
async function detectProductImages() {
  const found = [];
  for (let i = 0; i < MAX_IMAGES_TO_CHECK; i++) {
    const src = await findImageForIndex(i);
    if (!src) break;
    found.push(src);
  }
  return found;
}

/* ---------- build the page once images are detected ---------- */
(async function initGallery() {
  const productImages = await detectProductImages();

  // fallback so the page never renders empty if the folder path is wrong
  if (productImages.length === 0) {
    console.warn(`No images found at "${IMAGE_FOLDER_PATH}". Check IMAGE_FOLDER_PATH and file naming (image0.jpg, image1.jpg, ...).`);
    productImages.push("https://placehold.co/900x1125/ffffff/555?text=No+Image+Found");
  }

  /* ---------- render desktop gallery (stacked, scrolls with the page) ---------- */
  const desktopGallery = document.getElementById('galleryDesktop');
  productImages.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Product image ${i + 1}`;
    img.id = `image${i}`;              // labeling: image0, image1, image2...
    img.dataset.index = i;
    desktopGallery.appendChild(img);
  });

  /* ---------- render mobile gallery (horizontal scroll-snap) ---------- */
  const mobileScroller = document.getElementById('galleryMobileScroller');
  productImages.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Product image ${i + 1}`;
    img.id = `image${i}-mobile`;       // same labeling scheme, suffixed for the mobile DOM copy
    img.dataset.index = i;
    mobileScroller.appendChild(img);
  });

  /* ---------- mobile pagination pill: updates as the user swipes ---------- */
  const pill = document.getElementById('galleryPill');
  const totalImages = productImages.length;
  pill.textContent = `1 / ${totalImages}`;

  let scrollTimeout;
  mobileScroller.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const slideWidth = mobileScroller.clientWidth;
      const currentIndex = Math.round(mobileScroller.scrollLeft / slideWidth);
      pill.textContent = `${currentIndex + 1} / ${totalImages}`;
    }, 60);
  });
})();

/* ---------- quantity stepper ---------- */
const qtyValue = document.getElementById('qtyValue');
const qtyMinus = document.getElementById('qtyMinus');
const qtyPlus = document.getElementById('qtyPlus');
let qty = 1;

qtyMinus.addEventListener('click', () => {
  if (qty > 1) { qty--; qtyValue.textContent = qty; }
});
qtyPlus.addEventListener('click', () => {
  qty++; qtyValue.textContent = qty;
});