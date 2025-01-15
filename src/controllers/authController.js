const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const register = async (req, res) => {
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
};

const logout = (req, res) => {
    req.logout(() => {
        res.redirect('/login');
    });
};

module.exports = { register, logout };