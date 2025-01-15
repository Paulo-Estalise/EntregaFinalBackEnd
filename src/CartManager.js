const fs = require('fs').promises;

class CartManager {
    constructor(path) {
        this.path = path;
    }

    // Método para gerar um ID único
    async generateId() {
        const carts = await this.getCarts();
        if (carts.length === 0) return 1;
        return carts[carts.length - 1].id + 1;
    }

    // Método para obter todos os carrinhos
    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    // Método para obter um carrinho por ID
    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === id);
    }

    // Método para criar um novo carrinho
    async createCart() {
        const carts = await this.getCarts();
        const newCart = {
            id: await this.generateId(),
            products: []
        };

        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    // Método para adicionar um produto ao carrinho
    async addProductToCart(cartId, productId, quantity = 1) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);

        if (cartIndex === -1) {
            throw new Error("Carrinho não encontrado.");
        }

        const productIndex = carts[cartIndex].products.findIndex(product => product.product === productId);

        if (productIndex === -1) {
            // Adiciona o produto ao carrinho
            carts[cartIndex].products.push({ product: productId, quantity });
        } else {
            // Incrementa a quantidade do produto existente
            carts[cartIndex].products[productIndex].quantity += quantity;
        }

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return carts[cartIndex];
    }
}

module.exports = CartManager;