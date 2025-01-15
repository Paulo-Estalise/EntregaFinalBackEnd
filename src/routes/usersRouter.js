const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const logger = require('../utils/logger');
const nodemailer = require('nodemailer');

// Configuração do transporte de e-mail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retorna todos os usuários
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, { name: 1, email: 1, role: 1, _id: 0 });
        logger.info('Usuários recuperados com sucesso');
        res.status(200).json(users);
    } catch (error) {
        logger.error(`Erro ao buscar usuários: ${error.message}`);
        res.status(500).json({ message: 'Erro interno no servidor', error });
    }
});

/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Exclui usuários inativos
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Usuários inativos excluídos com sucesso
 *       500:
 *         description: Erro interno no servidor
 */
router.delete('/', async (req, res) => {
    try {
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Últimos 2 dias
        // Para teste, use os últimos 30 minutos:
        // const twoDaysAgo = new Date(Date.now() - 30 * 60 * 1000);

        const inactiveUsers = await User.find({ lastActivity: { $lt: twoDaysAgo } });

        for (const user of inactiveUsers) {
            // Envia e-mail de notificação
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Conta Excluída por Inatividade',
                text: `Olá ${user.name}, sua conta foi excluída por inatividade.`,
            };

            await transporter.sendMail(mailOptions);
            await User.deleteOne({ _id: user._id });
            logger.info(`Usuário excluído por inatividade: ${user.email}`);
        }

        res.status(200).json({ message: 'Usuários inativos excluídos com sucesso' });
    } catch (error) {
        logger.error(`Erro ao excluir usuários inativos: ${error.message}`);
        res.status(500).json({ message: 'Erro interno no servidor', error });
    }
});

module.exports = router;