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

const app = express();

mongoose.connect(config.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB Atlas'))
    .catch(err => console.error('Erro ao conectar ao MongoDB Atlas:', err));


app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

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

passport.use(new GitHubStrategy({
    clientID: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackURL: config.GITHUB_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
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

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const daoType = process.env.DAO_TYPE || 'mongo'; 
const dao = DAOFactory.getDAO(daoType);
const cartRepository = new CartRepository(dao);
const { isAdmin, isUser } = require('./src/middlewares/authMiddleware');
const productsRouter = require('./src/routes/productsRouter');
const cartsRouter = require('./src/routes/cartsRouter');
const viewsRouter = require('./src/routes/viewsRouter');
const authRouter = require('./src/routes/authRouter');
const ticketRouter = require('./src/routes/ticketRouter');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use('/auth', authRouter);
app.use('/api/tickets', ticketRouter);


app.post('/api/carts', isUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await cartRepository.createCart(userId);
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar carrinho', error });
    }
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erro interno no servidor', error: err.message });
});

// Inicia o servidor
app.listen(config.PORT, () => {
    console.log(`Servidor rodando na porta ${config.PORT}`);
});