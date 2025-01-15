const Product = require('../models/product.model');

class ProductManager {
    async getProducts() {
        return await Product.find();
    }

    async getProductById(id) {
        return await Product.findById(id);
    }

    async addProduct(product) {
        const newProduct = new Product(product);
        return await newProduct.save();
    }

    async updateProduct(id, updatedFields) {
        return await Product.findByIdAndUpdate(id, updatedFields, { new: true });
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }
}

module.exports = ProductManager;