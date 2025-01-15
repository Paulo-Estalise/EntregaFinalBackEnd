const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const config = require('./src/config/config');
const User = require('./src/models/user.model');
const DAOFactory = require('./src/daos/DAOFactory');
const CartRepository = require('./src/repositories/cartRepository');
const errorHandler = require('./src/middlewares/errorMiddleware');

const app = express();

// Conexão com MongoDB
mongoose.connect(config.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB Atlas'))
    .catch(err => console.error('Erro ao conectar ao MongoDB Atlas:', err));

// Configuração de sessão
app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Inicialização do Passport
app.use(passport.initialize());
app.use(passport.session());

// Estratégia de autenticação local
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Usuário não encontrado.' });
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false, { message: 'Senha incorreta.' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Estratégia de autenticação com GitHub
passport.use(new GitHubStrategy({
    clientID: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackURL: config.GITHUB_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
            user = new User({
                githubId: profile.id,
                email: profile.emails[0].value,
                role: 'user'
            });
            await user.save();
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Serialização e desserialização de usuários
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// Middleware para analisar JSON e URLs codificadas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de DAOs e Repositórios
const daoType = process.env.DAO_TYPE || 'mongo';
const dao = DAOFactory.getDAO(daoType);
const cartRepository = new CartRepository(dao);

// Importação de rotas
const productsRouter = require('./src/routes/productsRouter');
const cartsRouter = require('./src/routes/cartsRouter');
const viewsRouter = require('./src/routes/viewsRouter');
const authRouter = require('./src/routes/authRouter');
const ticketRouter = require('./src/routes/ticketRouter');
const { isAdmin, isUser } = require('./src/middlewares/authMiddleware');

// Definição de rotas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use('/auth', authRouter);
app.use('/api/tickets', ticketRouter);

// Endpoint para criação de carrinho
app.post('/api/carts', isUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await cartRepository.createCart(userId);
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar carrinho', error });
    }
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Inicialização do servidor
app.listen(config.PORT, () => {
    console.log(`Servidor rodando na porta ${config.PORT}`);
});
