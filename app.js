const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./src/models/user.model'); 
const productsRouter = require('./src/routes/productsRouter'); 
const cartsRouter = require('./src/routes/cartsRouter');
const viewsRouter = require('./src/routes/viewsRouter'); 
const authRouter = require('./src/routes/authRouter'); 

const app = express();
const PORT = 8080;

app.use(session({
    secret: 'seuSegredoAqui', // Chave secreta para assinar a sessão
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ email: username });
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

// Rotas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use('/auth', authRouter); // Rotas de autenticação

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});