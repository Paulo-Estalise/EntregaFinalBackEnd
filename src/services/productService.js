const ProductRepository = require('../repositories/productRepository');

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async findAll() {
    return this.productRepository.findAll();
  }

  async findById(id) {
    return this.productRepository.findById(id);
  }

  async create(productData) {
    return this.productRepository.create(productData);
  }

  async update(id, productData) {
    return this.productRepository.update(id, productData);
  }

  async delete(id) {
    return this.productRepository.delete(id);
  }
}

module.exports = ProductService;