const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const { isAdmin } = require('../middlewares/authMiddleware');

// Middleware para verificar se o usuário é admin
router.use(isAdmin);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Retorna todos os usuários (apenas para admin)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       403:
 *         description: Acesso não autorizado
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno no servidor', error });
    }
});

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Atualiza a função de um usuário (apenas para admin)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin, premium]
 *     responses:
 *       200:
 *         description: Função do usuário atualizada com sucesso
 *       403:
 *         description: Acesso não autorizado
 *       500:
 *         description: Erro interno no servidor
 */
router.put('/users/:id', async (req, res) => {
    try {
        const { role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno no servidor', error });
    }
});

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Exclui um usuário (apenas para admin)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       204:
 *         description: Usuário excluído com sucesso
 *       403:
 *         description: Acesso não autorizado
 *       500:
 *         description: Erro interno no servidor
 */
router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Erro interno no servidor', error });
    }
});

module.exports = router;