const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./src/config/config');
const User = require('./src/models/user.model');
const DAOFactory = require('./src/daos/DAOFactory');
const CartRepository = require('./src/repositories/cartRepository');
const errorHandler = require('./src/middlewares/errorMiddleware');
const setupSwagger = require('./src/config/swagger'); 

const app = express();

// Conexão com MongoDB
mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB Atlas'))
    .catch(err => console.error('Erro ao conectar ao MongoDB Atlas:', err));

// Configuração de sessão
app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Middleware para analisar JSON e URLs codificadas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicialização do Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuração de DAOs e Repositórios
const daoType = process.env.DAO_TYPE || 'mongo';
const dao = DAOFactory.getDAO(daoType);
const cartRepository = new CartRepository(dao);

// Configuração das rotas
const productsRouter = require('./src/routes/productsRouter');
const cartsRouter = require('./src/routes/cartsRouter');
const viewsRouter = require('./src/routes/viewsRouter');
const authRouter = require('./src/routes/authRouter');
const ticketRouter = require('./src/routes/ticketRouter');
const testRouter = require('./src/routes/testRouter');
const { isAdmin, isUser } = require('./src/middlewares/authMiddleware');

// Definição de rotas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use('/auth', authRouter);
app.use('/api/tickets', ticketRouter);
app.use('/api/test', testRouter);

// Configuração do Swagger
setupSwagger(app);

// Endpoint para criação de carrinho
app.post('/api/carts', isUser, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cart = await cartRepository.createCart(userId);
        res.status(201).json(cart);
    } catch (error) {
        next(error);
    }
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Inicialização do servidor
app.listen(config.PORT, () => {
    console.log(`Servidor rodando na porta ${config.PORT}`);
});
