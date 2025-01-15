const express = require('express');
const CartManager = require('../mongo/CartManager');
const router = express.Router();
const cartManager = new CartManager();

// Rota para obter um carrinho específico
router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        res.render('cart', { cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Rota para atualizar o carrinho com uma lista de produtos
router.put('/:cid', async (req, res) => {
    try {
        const updatedCart = await cartManager.updateCart(req.params.cid, req.body.products);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Rota para atualizar a quantidade de um produto no carrinho
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const updatedCart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Rota para remover todos os produtos do carrinho
router.delete('/:cid', async (req, res) => {
    try {
        const updatedCart = await cartManager.clearCart(req.params.cid);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;