const express = require('express');
const ProductManager = require('../../mongo/ProductManager');

const router = express.Router();
const productManager = new ProductManager('./src/products.json');

// Listar todos os produtos
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const products = await productManager.getProducts();
        res.json(limit ? products.slice(0, limit) : products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obter um produto por ID
router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(parseInt(req.params.pid));
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: "Produto não encontrado." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Adicionar um produto
router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Atualizar um produto
router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(parseInt(req.params.pid), req.body);
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Deletar um produto
router.delete('/:pid', async (req, res) => {
    try {
        await productManager.deleteProduct(parseInt(req.params.pid));
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;