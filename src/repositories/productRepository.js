const Product = require('../models/product.model');

class ProductRepository {
  async findAll() {
    return Product.find();
  }

  async findById(id) {
    return Product.findById(id);
  }

  async create(productData) {
    const product = new Product(productData);
    return product.save();
  }

  async update(id, productData) {
    return Product.findByIdAndUpdate(id, productData, { new: true });
  }

  async delete(id) {
    return Product.findByIdAndDelete(id);
  }
}

module.exports = ProductRepository;