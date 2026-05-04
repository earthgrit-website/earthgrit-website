# EarthGrit Website – Developer Guide
Produced by EarthGrit for TechLeg Ltd (UK)

---

## File Structure

earthgrit-website/
├── index.html        Main page — HTML structure only, no inline logic
├── style.css         All visual styles (colours, fonts, layout)
├── products.js       Product data — ADD/EDIT/REMOVE products here
├── offers.js         Discount and offer rules
├── reviews.js        Customer reviews data
├── cart.js           Cart logic, form validation, Stripe & WhatsApp checkout
├── app.js            Builds product cards, image carousel, reviews display
├── stall.js          Stall dates data & builder — ADD/EDIT market dates here
├── analytics.js      Google Analytics loader + cookie consent logic
├── privacy.html      Privacy policy page
├── thankyou.html     Shown after successful payment
├── failed.html       Shown after cancelled/failed payment
├── logo.jpg          EarthGrit logo (used in nav and hero)
└── images/           All product photos go here

---

## Script Load Order in index.html

The order at the bottom of index.html must stay exactly as follows:

1. offers.js      — discount/offer rules (used by products.js & cart.js)
2. products.js    — product data
3. reviews.js     — reviews data
4. cart.js        — cart state, checkout, WhatsApp
5. app.js         — builds product cards, carousels, reviews display
6. stall.js       — stall dates data & builder
7. analytics.js   — Google Analytics + cookie consent

---

## Common Tasks

### ➕ Add a New Product
**File to edit: `products.js`**

Copy an existing product block and update the fields:

```js
{
  id: "unique-id",           // Must be unique, no spaces (e.g. "honey-bites")
  images: ["images/your-photo.jpg"],  // Add more images for carousel
  emoji: "🍯",
  badge: "NEW",              // Or "" for no badge
  name: "Product Name",
  tagline: "Short one-line description",
  priceNow: 6,               // Current price in £
  priceWas: 8,               // Strike-through price — remove line if no sale
  priceNote: "Per box",      // Small note under price
  unit: "box",               // Used in cart (e.g. "box", "pack", "kg")
  description: "Full description text.",
  ingredients: "Ingredient 1, Ingredient 2, ...",
  nutrition: null,           // Set to null to hide — add text when ready
  extraNote: ""              // Optional green highlight note, or ""
}
```

No changes needed to `index.html`, `app.js` or any other file.

---

### ✏️ Edit a Product (price, name, description, etc.)
**File to edit: `products.js`**

Find the product by its `id` and update the relevant field.

---

### ❌ Remove a Product
**File to edit: `products.js`**

Delete the entire `{ ... }` block for that product.
Make sure the remaining blocks still have commas between them.

---

### 📊 Add Nutrition Info to a Product
**File to edit: `products.js`**

Change `nutrition: null` to:
```js
nutrition: "Per 100g: Energy 420kcal | Protein 8g | Carbs 52g | Sugars 18g | Fat 22g | Fibre 6g | Salt 0.1g"
```
The Nutrition tab will appear automatically on that product card.

---

### 🖼️ Add Product Photos
1. Put your image files inside the `images/` folder
2. In `products.js`, update the `images` array:
```js
images: ["images/photo1.jpg", "images/photo2.jpg"]
```
Multiple images = automatic carousel with arrows and dots.

---

### ⭐ Add a Customer Review
**File to edit: `reviews.js`**

Add a new block to the `REVIEWS` array:
```js
{
  stars: 5,
  text: "Review text here on a single line.",
  author: "First Name L.",
  source: "Google"   // or "Trustpilot"
}
```
Only 5-star reviews are shown. 4 are picked randomly on each page load.

---

### 📅 Add a Market Stall Date
**File to edit: `stall.js`**

Add a new block to the `STALL_DATES` array:
```js
{
  date: "Saturday 3 May 2025",
  time: "9am – 3pm",
  location: "MK Market, Central Milton Keynes",
  maps: "https://maps.google.com/?q=Central+Milton+Keynes+Market",
  active: true
}
```
Set `active: false` to hide a date without deleting it.
The grid on the Find Us section updates automatically.

---

### 🏷️ Add/Change a Discount or Offer
**File to edit: `offers.js`**

Offers are tied to product IDs. See existing offers in that file for format.

---

### 🎨 Change Colours or Fonts
**File to edit: `style.css`**

Brand colours are listed at the top of the file:
- Dark green: `#2d5a27`
- Gold:       `#c9973a`
- Cream bg:   `#faf7f2`

---

### 💳 Change the Payment Endpoint or WhatsApp Number
**File to edit: `cart.js`** (top of file)

```js
var CHECKOUT_API_URL = 'https://api-vzhrfgyteq-uc.a.run.app/createStripeSession';
var WHATSAPP_NUMBER  = '447344445351';
```

---

### 📊 Change Google Analytics ID
**File to edit: `analytics.js`**

Update the GA ID in two places near the top of the file:
```js
s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
...
gtag('config', 'G-XXXXXXXXXX');
```

---

### ✅ After Successful Payment / ❌ After Failed Payment
**Files to edit: `thankyou.html` / `failed.html`**

These are standalone pages. Edit text directly in those files.
When going live, update the redirect URLs in your Firebase function to point to:
- `https://earthgrit.co.uk/thankyou.html`
- `https://earthgrit.co.uk/failed.html`

---

### 🔒 Cookie Consent Behaviour
**File: `analytics.js`** — no edits needed unless changing behaviour.

- User clicks **Accept** → Google Analytics loads, choice saved
- User clicks **Decline** → GA never loads, no tracking at all, choice saved
- On return visits → banner does not show again, previous choice is respected
- To reset consent (for testing): open browser console and type:
  `localStorage.removeItem('cookieConsent')` then refresh

---

## Rules to Remember

| Rule | Why |
|---|---|
| Never break inside a JS string with Enter | Causes silent JS errors |
| Every `{ }` block in an array needs a comma after it (except the last) | Syntax error otherwise |
| Product `id` must be unique and have no spaces | Used as HTML element ID |
| `images/` paths are case-sensitive on live servers | Match filename exactly |
| Script load order in index.html must stay the same | Later scripts depend on earlier ones |
| Do not add `<script>` blocks inside index.html | All logic lives in .js files only |