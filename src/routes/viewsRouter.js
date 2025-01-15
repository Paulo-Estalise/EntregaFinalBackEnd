const express = require('express');
const router = express.Router();
const ProductManager = require('../mongo/ProductManager');
const productManager = new ProductManager();

// Rota para exibir produtos com paginação
router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const filter = {};
        if (query) {
            filter.$or = [
                { category: query },
                { status: query === 'available' },
            ];
        }

        const sortOptions = {};
        if (sort === 'asc') sortOptions.price = 1;
        if (sort === 'desc') sortOptions.price = -1;

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sortOptions,
            lean: true,
        };

        const result = await productManager.getProducts(filter, options);

        res.render('products', {
            products: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
        res.status(500).render('error', { message: error.message });
    }
});

module.exports = router;