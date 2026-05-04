// ============================================================
// EARTHGRIT OFFERS — MANAGE ALL PROMOTIONS HERE
// ============================================================

const OFFERS = [
  
  {
    productId: "energy-bites",
    active: true,
    type: "bundle",
    bundleQuantity: 2,           // ✓ Buy 2 boxes
    bundlePrice: 8,              // ✓ Get them for £8 total
    displayText: "£8 for 2 boxes",
    badgeText: "BUNDLE DEAL"
  },

  // Example: Percentage discount
  // {
  //   productId: "protein-bars",
  //   active: true,
  //   type: "percentage",
  //   discount: 20,
  //   displayText: "20% off today",
  //   badgeText: "SALE"
  // },

  // Example: Fixed discount
  // {
  //   productId: "postpartum-delight",
  //   active: true,
  //   type: "fixed",
  //   discount: 10,
  //   minQuantity: 1,
  //   displayText: "Save £10",
  //   badgeText: "LIMITED"
  // }

];

// Helper function to get active offer for a product
function getOffer(productId) {
  return OFFERS.find(o => o.productId === productId && o.active);
}

// Calculate effective price with offer applied
function calculatePrice(productId, quantity, basePrice) {
  const offer = getOffer(productId);
  
  if (!offer) return basePrice * quantity;
  
  if (offer.type === "bundle") {
    // Smart bundle calculation
    const bundles = Math.floor(quantity / offer.bundleQuantity);
    const remainder = quantity % offer.bundleQuantity;
    return (bundles * offer.bundlePrice) + (remainder * basePrice);
  }
  
  if (offer.type === "percentage") {
    return basePrice * quantity * (1 - offer.discount / 100);
  }
  
  if (offer.type === "fixed" && quantity >= (offer.minQuantity || 1)) {
    return (basePrice * quantity) - offer.discount;
  }
  
  return basePrice * quantity;
}

// Get display price per unit (for cart display)
function getUnitPrice(productId, quantity, basePrice) {
  const offer = getOffer(productId);
  
  if (!offer) return basePrice;
  
  if (offer.type === "bundle" && quantity >= offer.bundleQuantity) {
    // Show average price when bundle applies
    const totalPrice = calculatePrice(productId, quantity, basePrice);
    return totalPrice / quantity;
  }
  
  if (offer.type === "percentage") {
    return basePrice * (1 - offer.discount / 100);
  }
  
  if (offer.type === "fixed" && quantity >= (offer.minQuantity || 1)) {
    return (basePrice * quantity - offer.discount) / quantity;
  }
  
  return basePrice;
}