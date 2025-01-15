const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const logger = require('../utils/logger'); // Importando o logger

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Gerenciamento de produtos
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retorna todos os produtos
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número máximo de produtos por página
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Ordenação dos produtos por preço (asc ou desc)
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Filtro por categoria ou disponibilidade
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 totalPages:
 *                   type: integer
 *                 prevPage:
 *                   type: integer
 *                 nextPage:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 hasPrevPage:
 *                   type: boolean
 *                 hasNextPage:
 *                   type: boolean
 *                 prevLink:
 *                   type: string
 *                 nextLink:
 *                   type: string
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const filter = query ? { 
            $or: [{ category: query }, { status: query === 'available' }] 
        } : {};

        const sortOptions = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sortOptions,
            lean: true,
        };

        const result = await productController.getProducts(filter, options);

        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage 
                ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` 
                : null,
            nextLink: result.hasNextPage 
                ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` 
                : null,
        };

        logger.info('Produtos recuperados com sucesso'); // Log de info
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Erro ao buscar produtos: ${error.message}`); // Log de erro
        res.status(500).json({ status: 'error', message: error.message });
    }
});

/**
 * @swagger
 * /api/products/mockingproducts:
 *   get:
 *     summary: Gera 100 produtos fictícios
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos fictícios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Erro ao gerar produtos fictícios
 */
router.get('/mockingproducts', (req, res) => {
    try {
        const mockProducts = productController.getMockProducts();
        logger.debug('Produtos fictícios gerados com sucesso'); // Log de debug
        res.status(200).json(mockProducts);
    } catch (error) {
        logger.error(`Erro ao gerar produtos fictícios: ${error.message}`); // Log de erro
        res.status(500).json({ message: 'Erro ao gerar produtos fictícios', error });
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Retorna um produto pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/:id', async (req, res) => {
    try {
        const product = await productController.getProductById(req.params.id);
        if (!product) {
            logger.warn(`Produto não encontrado: ${req.params.id}`); // Log de warning
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        logger.info(`Produto encontrado: ${req.params.id}`); // Log de info
        res.status(200).json(product);
    } catch (error) {
        logger.error(`Erro ao buscar produto: ${error.message}`); // Log de erro
        res.status(500).json({ message: 'Erro interno no servidor', error });
    }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Erro ao criar produto
 */
router.post('/', async (req, res) => {
    try {
        const newProduct = await productController.createProduct(req.body);
        logger.info('Produto criado com sucesso'); // Log de info
        res.status(201).json(newProduct);
    } catch (error) {
        logger.error(`Erro ao criar produto: ${error.message}`); // Log de erro
        res.status(500).json({ message: 'Erro ao criar produto', error });
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro ao atualizar produto
 */
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await productController.updateProduct(req.params.id, req.body);
        if (!updatedProduct) {
            logger.warn(`Produto não encontrado para atualização: ${req.params.id}`); // Log de warning
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        logger.info(`Produto atualizado: ${req.params.id}`); // Log de info
        res.status(200).json(updatedProduct);
    } catch (error) {
        logger.error(`Erro ao atualizar produto: ${error.message}`); // Log de erro
        res.status(500).json({ message: 'Erro ao atualizar produto', error });
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Exclui um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto
 *     responses:
 *       204:
 *         description: Produto excluído com sucesso
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro ao excluir produto
 */
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await productController.deleteProduct(req.params.id);
        if (!deletedProduct) {
            logger.warn(`Produto não encontrado para exclusão: ${req.params.id}`); // Log de warning
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        logger.info(`Produto excluído: ${req.params.id}`); // Log de info
        res.status(204).end();
    } catch (error) {
        logger.error(`Erro ao excluir produto: ${error.message}`); // Log de erro
        res.status(500).json({ message: 'Erro ao excluir produto', error });
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID do produto
 *         name:
 *           type: string
 *           description: Nome do produto
 *         description:
 *           type: string
 *           description: Descrição do produto
 *         price:
 *           type: number
 *           description: Preço do produto
 *         category:
 *           type: string
 *           description: Categoria do produto
 *         stock:
 *           type: number
 *           description: Quantidade em estoque
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data de atualização
 */

module.exports = router;