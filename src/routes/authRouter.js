const express = require('express');
const passport = require('passport');
const { register, logout } = require('../controllers/authController');
const router = express.Router();

// Rota de registro
router.post('/register', register);

// Rota de login com autenticação local
router.post('/login', passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/login',
    failureFlash: true
}));

// Rota para autenticação com GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback da autenticação do GitHub
router.get('/github/callback', passport.authenticate('github', {
    successRedirect: '/products',
    failureRedirect: '/login'
}));

// Rota de logout
router.get('/logout', logout);

module.exports = router;
