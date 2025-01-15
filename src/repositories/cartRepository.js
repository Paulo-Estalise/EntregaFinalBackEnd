class CartRepository {
    constructor(dao) {
      this.dao = dao;
    }
  
    async createCart(userId) {
      return this.dao.create({ userId, products: [] });
    }
  
    async getCartById(cartId) {
      return this.dao.findById(cartId);
    }
  
    async addProductToCart(cartId, productId, quantity) {
      const cart = await this.dao.findById(cartId);
      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );
  
      if (productIndex >= 0) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
  
      return this.dao.update(cartId, cart);
    }
  
    async removeProductFromCart(cartId, productId) {
      const cart = await this.dao.findById(cartId);
      cart.products = cart.products.filter(
        (item) => item.product.toString() !== productId
      );
      return this.dao.update(cartId, cart);
    }
  
    async clearCart(cartId) {
      return this.dao.update(cartId, { products: [] });
    }
  
    async deleteCart(cartId) {
      return this.dao.delete(cartId);
    }
  }
  
  module.exports = CartRepository;