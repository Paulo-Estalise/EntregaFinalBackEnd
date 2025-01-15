const CartService = require('../services/cartService');

const cartController = {
  async addProductToCart(req, res, next) {
    try {
      const { cartId, productId, quantity } = req.body;
      const updatedCart = await CartService.addProductToCart(cartId, productId, quantity);
      res.status(200).json(updatedCart);
    } catch (error) {
      if (error.message === 'INSUFFICIENT_STOCK') {
        next(new Error('INSUFFICIENT_STOCK')); // Erro personalizado
      } else {
        next(error);
      }
    }
  },

  async removeProductFromCart(req, res, next) {
    try {
      const { cartId, productId } = req.body;
      const updatedCart = await CartService.removeProductFromCart(cartId, productId);
      res.status(200).json(updatedCart);
    } catch (error) {
      next(error);
    }
  },

  async clearCart(req, res, next) {
    try {
      const { cartId } = req.body;
      await CartService.clearCart(cartId);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },

  async purchaseCart(req, res, next) {
    try {
      const { cartId } = req.params;
      const ticket = await CartService.purchaseCart(cartId);
      res.status(200).json(ticket);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = cartController;