const Cart = require('../models/cart.model');

class CartManager {
    async getCartById(id) {
        return await Cart.findById(id).populate('products.product');
    }

    async updateCart(cartId, products) {
        const cart = await Cart.findById(cartId);
        cart.products = products;
        return await cart.save();
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId);
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex === -1) {
            throw new Error('Produto não encontrado no carrinho.');
        }

        cart.products[productIndex].quantity = quantity;
        return await cart.save();
    }

    async clearCart(cartId) {
        const cart = await Cart.findById(cartId);
        cart.products = [];
        return await cart.save();
    }
}

module.exports = CartManager;