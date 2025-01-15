const express = require('express');
const passport = require('passport');
const router = express.Router();


router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const role = email === 'adminCoder@coder.com' ? 'admin' : 'user'; 
        const newUser = new User({ email, password: hashedPassword, role });
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário.' });
    }
});


router.post('/login', passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/login',
    failureFlash: true
}));


router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));


router.get('/github/callback', passport.authenticate('github', {
    successRedirect: '/products',
    failureRedirect: '/login'
}));


router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/login');
    });
});

module.exports = router;