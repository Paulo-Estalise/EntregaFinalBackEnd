const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const productsRouter = require('./routes/productsRouter');
const cartsRouter = require('./routes/cartsRouter');
const viewsRouter = require('./routes/viewsRouter');
const Message = require('./dao/models/message.model');

const app = express();
const PORT = 8080;

// Conexão com o MongoDB
mongoose.connect('mongodb+srv://<usuario>:<senha>@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Configuração do Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Middleware para processar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Cria o servidor HTTP e o Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configura o Socket.IO para o chat
io.on('connection', (socket) => {
    console.log('Novo cliente conectado');

    // Recebe uma nova mensagem e salva no MongoDB
    socket.on('newMessage', async (message) => {
        const newMessage = new Message(message);
        await newMessage.save();

        // Emite a mensagem para todos os clientes
        io.emit('messageReceived', newMessage);
    });
});

// Inicia o servidor
httpServer.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});