const ProductService = require('../services/productService');
const MockingModule = require('../utils/mockingModule');

const productController = {
  // Endpoint para gerar produtos fictícios
  async getMockProducts(req, res) {
    try {
      const mockProducts = MockingModule.generateMockProducts(100);
      res.status(200).json(mockProducts);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao gerar produtos fictícios', error });
    }
  },

  // Outros métodos do controller
  async getProductById(req, res) {
    try {
      const product = await ProductService.findById(req.params.id);
      if (!product) {
        throw new Error('PRODUCT_NOT_FOUND'); // Erro personalizado
      }
      res.status(200).json(product);
    } catch (error) {
      next(error); // Passa o erro para o middleware de tratamento
    }
  },

  async createProduct(req, res) {
    try {
      const newProduct = await ProductService.create(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  },

  async updateProduct(req, res) {
    try {
      const updatedProduct = await ProductService.update(req.params.id, req.body);
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  },

  async deleteProduct(req, res) {
    try {
      await ProductService.delete(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;