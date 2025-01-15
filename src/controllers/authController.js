const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const AuthService = require('../services/authService'); // Certifique-se de que este serviço esteja implementado

const authController = {
    async register(req, res) {
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
    },

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await AuthService.login(email, password);
            if (!user) {
                throw new Error('UNAUTHORIZED_ACCESS');
            }
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    },

    logout(req, res) {
        req.logout(() => {
            res.redirect('/login');
        });
    }
};

module.exports = authController;
