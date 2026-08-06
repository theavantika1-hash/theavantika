/**
 * Helper utility to handle user dining mode selections on the welcome landing screen.
 * 
 * - Dine-In & Pickup: Bypasses scanner/popups and directly loads the full menu catalog.
 * - Delivery: Directly opens the main landing page of the website.
 */
export const handleDiningModeSelection = (
  mode,
  setDiningMode,
  setShowAllProductsPage
) => {
  if (mode === 'delivery') {
    setDiningMode(mode);
    return;
  }
  if (mode === 'pickup' || mode === 'dine-in') {
    setDiningMode(mode);
    setShowAllProductsPage(true); // Auto open full menu catalogue page
    return;
  }
};
