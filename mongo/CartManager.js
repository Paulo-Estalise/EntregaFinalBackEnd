const Cart = require('../models/cart.model');

class CartManager {
    async createCart() {
        const newCart = new Cart();
        return await newCart.save();
    }

    async getCartById(id) {
        return await Cart.findById(id).populate('products.product');
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await Cart.findById(cartId);
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex === -1) {
            cart.products.push({ product: productId, quantity });
        } else {
            cart.products[productIndex].quantity += quantity;
        }

        return await cart.save();
    }
}

module.exports = CartManager;