const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./src/models/user.model'); // Modelo de usuário
const productsRouter = require('./src/routes/productsRouter'); // Importe o productsRouter
const cartsRouter = require('./src/routes/cartsRouter'); // Importe o cartsRouter
const viewsRouter = require('./src/routes/viewsRouter'); // Importe o viewsRouter
const authRouter = require('./src/routes/authRouter'); // Importe o authRouter

const app = express();
const PORT = 8080;

// Conexão com o MongoDB
mongoose.connect('mongodb+srv://usuario:senha@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority')
    .then(() => console.log('Conectado ao MongoDB Atlas'))
    .catch(err => console.error('Erro ao conectar ao MongoDB Atlas:', err));

// Configuração do express-session
app.use(session({
    secret: 'seuSegredoAqui', // Chave secreta para assinar a sessão
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Defina como true se estiver usando HTTPS
}));

// Inicialize o Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuração da estratégia local do Passport
passport.use(new LocalStrategy(
    { usernameField: 'email' }, // Campo de email
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

// Configuração da estratégia do GitHub
passport.use(new GitHubStrategy({
    clientID: 'SEU_CLIENT_ID', // Substitua pelo seu Client ID do GitHub
    clientSecret: 'SEU_CLIENT_SECRET', // Substitua pelo seu Client Secret do GitHub
    callbackURL: 'http://localhost:8080/auth/github/callback' // URL de callback
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
            // Cria um novo usuário se não existir
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

// Serialização e desserialização do usuário
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

// Middleware para processar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use('/auth', authRouter); // Rotas de autenticação

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});