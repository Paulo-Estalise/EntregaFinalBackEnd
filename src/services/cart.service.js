const CartManager = require('../dao/mongo/CartManager');
const cartManager = new CartManager();

module.exports = {
    createCart: cartManager.createCart,
    getCartById: cartManager.getCartById,
    addProductToCart: cartManager.addProductToCart,
};