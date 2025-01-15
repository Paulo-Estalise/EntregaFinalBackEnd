const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./src/models/user.model'); 
const productsRouter = require('./src/routes/productsRouter'); 
const cartsRouter = require('./src/routes/cartsRouter'); 
const viewsRouter = require('./src/routes/viewsRouter'); 
const authRouter = require('./src/routes/authRouter'); 

const app = express();
const PORT = 8080;

// Conexão com o MongoDB
mongoose.connect('mongodb+srv://usuario:senha@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority')
    .then(() => console.log('Conectado ao MongoDB Atlas'))
    .catch(err => console.error('Erro ao conectar ao MongoDB Atlas:', err));


app.use(session({
    secret: 'seuSegredoAqui', 
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
    clientID: 'Ov23li2X5P6S9hsQvhXa', 
    clientSecret: '683e26271a51adeff220525c83a72d652104252e', 
    callbackURL: 'http://localhost:8080/auth/github/callback' 
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


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use('/auth', authRouter); 

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});