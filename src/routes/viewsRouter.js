const express = require('express');
const router = express.Router();
const ProductManager = require('../dao/mongo/ProductManager');
const productManager = new ProductManager();

// Rota para a view "home"
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para a view "realTimeProducts"
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para a view "chat"
router.get('/chat', (req, res) => {
    res.render('chat');
});

module.exports = router;