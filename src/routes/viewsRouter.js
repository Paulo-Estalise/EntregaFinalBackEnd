const express = require('express');
const router = express.Router();

// Rota para a view de produtos
router.get('/products', (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }
    res.render('products', { user: req.user, products: [] }); // Passe os produtos aqui
});

// Rota para a view de login
router.get('/login', (req, res) => {
    res.render('login');
});

// Rota para a view de registro
router.get('/register', (req, res) => {
    res.render('register');
});

module.exports = router;