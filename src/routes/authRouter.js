const express = require('express');
const router = express.Router(); 
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

// Rota de registro
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const role = email === 'adminCoder@coder.com' ? 'admin' : 'user'; // Define o role
        const newUser = new User({ email, password: hashedPassword, role });
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário.' });
    }
});

// Rota de login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/login',
    failureFlash: true
}));

// Rota de logout
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/login');
    });
});

module.exports = router; // Exporte o router