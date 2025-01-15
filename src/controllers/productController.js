const ProductService = require('../services/productService');
const MockingModule = require('../utils/mockingModule');
const logger = require('../utils/logger');

const productController = {
    async getMockProducts(req, res, next) {
        try {
            const mockProducts = MockingModule.generateMockProducts(100);
            res.status(200).json(mockProducts);
        } catch (error) {
            logger.error(`Erro ao gerar produtos fictícios: ${error.message}`);
            next(error);
        }
    },

    async getProductById(req, res, next) {
        try {
            const product = await ProductService.findById(req.params.id);
            if (!product) {
                logger.warn(`Produto não encontrado: ${req.params.id}`);
                return res.status(404).json({ message: 'Produto não encontrado' });
            }
            logger.info(`Produto encontrado: ${req.params.id}`);
            res.status(200).json(product);
        } catch (error) {
            logger.error(`Erro ao buscar produto: ${error.message}`);
            next(error);
        }
    },

    async createProduct(req, res, next) {
        try {
            const newProduct = await ProductService.create(req.body);
            res.status(201).json(newProduct);
        } catch (error) {
            logger.error(`Erro ao criar produto: ${error.message}`);
            next(error);
        }
    },

    async updateProduct(req, res, next) {
        try {
            const updatedProduct = await ProductService.update(req.params.id, req.body);
            if (!updatedProduct) {
                logger.warn(`Tentativa de atualizar produto não encontrado: ${req.params.id}`);
                return res.status(404).json({ message: 'Produto não encontrado para atualização' });
            }
            res.status(200).json(updatedProduct);
        } catch (error) {
            logger.error(`Erro ao atualizar produto: ${error.message}`);
            next(error);
        }
    },

    async deleteProduct(req, res, next) {
        try {
            const deleted = await ProductService.delete(req.params.id);
            if (!deleted) {
                logger.warn(`Tentativa de deletar produto não encontrado: ${req.params.id}`);
                return res.status(404).json({ message: 'Produto não encontrado para exclusão' });
            }
            res.status(204).end();
        } catch (error) {
            logger.error(`Erro ao deletar produto: ${error.message}`);
            next(error);
        }
    }
};

module.exports = productController;
