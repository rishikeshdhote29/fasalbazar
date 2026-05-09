/**
 * Inventory Management Utility
 * Handles stock validation, reservation, and deduction operations
 */

const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

/**
 * Check if product has sufficient stock
 * @param {String} productId - Product ID
 * @param {Number} requiredQuantity - Quantity needed
 * @returns {Object} { hasStock: boolean, availableQuantity: number, message: string }
 */
exports.checkStock = asyncHandler(async (productId, requiredQuantity) => {
  const product = await Product.findById(productId);

  if (!product) {
    return {
      hasStock: false,
      availableQuantity: 0,
      message: 'Product not found',
    };
  }

  if (product.isInactive || !product.isAvailable) {
    return {
      hasStock: false,
      availableQuantity: 0,
      message: `${product.name} is not available`,
    };
  }

  if (product.quantity < requiredQuantity) {
    return {
      hasStock: false,
      availableQuantity: product.quantity,
      message: `Insufficient stock. Only ${product.quantity} unit(s) available for ${product.name}`,
    };
  }

  return {
    hasStock: true,
    availableQuantity: product.quantity,
    message: 'Stock available',
  };
});

/**
 * Deduct stock from product when order is confirmed
 * @param {String} productId - Product ID
 * @param {Number} quantityToDeduct - Quantity to deduct
 * @returns {Object} { success: boolean, remainingStock: number, message: string }
 */
exports.deductStock = asyncHandler(async (productId, quantityToDeduct) => {
  const product = await Product.findById(productId);

  if (!product) {
    return {
      success: false,
      remainingStock: 0,
      message: 'Product not found',
    };
  }

  if (product.quantity < quantityToDeduct) {
    return {
      success: false,
      remainingStock: product.quantity,
      message: `Cannot deduct ${quantityToDeduct} units. Only ${product.quantity} available`,
    };
  }

  // Deduct stock
  product.quantity -= quantityToDeduct;

  // Mark as unavailable if out of stock
  if (product.quantity <= 0) {
    product.isAvailable = false;
    product.quantity = 0;
  }

  await product.save();

  return {
    success: true,
    remainingStock: product.quantity,
    message: `Stock deducted. Remaining: ${product.quantity}`,
  };
});

/**
 * Restore stock (for cancelled orders)
 * @param {String} productId - Product ID
 * @param {Number} quantityToRestore - Quantity to restore
 * @returns {Object} { success: boolean, newStock: number, message: string }
 */
exports.restoreStock = asyncHandler(async (productId, quantityToRestore) => {
  const product = await Product.findById(productId);

  if (!product) {
    return {
      success: false,
      newStock: 0,
      message: 'Product not found',
    };
  }

  product.quantity += quantityToRestore;
  product.isAvailable = true;

  await product.save();

  return {
    success: true,
    newStock: product.quantity,
    message: `Stock restored. New quantity: ${product.quantity}`,
  };
});

/**
 * Check low stock products for a seller
 * @param {String} sellerId - Seller ID
 * @param {Number} threshold - Low stock threshold (default: 5)
 * @returns {Array} Array of low stock products
 */
exports.getLowStockProducts = asyncHandler(
  async (sellerId, threshold = 5) => {
    const lowStockProducts = await Product.find({
      seller: sellerId,
      quantity: { $lte: threshold },
      isInactive: false,
    }).select('name quantity price _id');

    return lowStockProducts;
  }
);

/**
 * Get inventory summary for a seller
 * @param {String} sellerId - Seller ID
 * @returns {Object} Inventory summary stats
 */
exports.getInventorySummary = asyncHandler(async (sellerId) => {
  const products = await Product.find({ seller: sellerId, isInactive: false });

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const outOfStock = products.filter((p) => p.quantity === 0).length;
  const lowStock = products.filter((p) => p.quantity > 0 && p.quantity <= 5)
    .length;

  return {
    totalProducts,
    totalStock,
    outOfStock,
    lowStock,
    products,
  };
});

