const express = require('express');
const ProductManager = require('../mongo/ProductManager');
const router = express.Router();
const productManager = new ProductManager();

// Rota GET para listar produtos com paginação, filtros e ordenação
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        // Opções de filtro
        const filter = {};
        if (query) {
            filter.$or = [
                { category: query }, // Filtra por categoria
                { status: query === 'available' }, // Filtra por disponibilidade
            ];
        }

        // Opções de ordenação
        const sortOptions = {};
        if (sort === 'asc') sortOptions.price = 1;
        if (sort === 'desc') sortOptions.price = -1;

        // Paginação
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sortOptions,
            lean: true, // Retorna objetos JavaScript simples em vez de documentos Mongoose
        };

        // Consulta ao banco de dados
        const result = await productManager.getProducts(filter, options);

        // Resposta formatada
        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null,
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;