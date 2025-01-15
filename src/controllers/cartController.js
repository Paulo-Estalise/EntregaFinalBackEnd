const CartManager = require('../mongo/CartManager');
const cartManager = new CartManager();

const getCartById = async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        res.render('cart', { cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = { getCartById };