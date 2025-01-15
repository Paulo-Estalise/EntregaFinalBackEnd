const express = require('express');
const bcrypt = require('bcrypt');
const ProductManager = require('../mongo/ProductManager');
const User = require('../models/user.model');
const MockingModule = require('../utils/mockingModule');

const router = express.Router();
const productManager = new ProductManager();

const registerUser = async (req, res) => {
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
};

const logoutUser = (req, res) => {
    req.logout(() => {
        res.redirect('/login');
    });
};

const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const filter = query ? { 
            $or: [{ category: query }, { status: query === 'available' }] 
        } : {};

        const sortOptions = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sortOptions,
            lean: true,
        };

        const result = await productManager.getProducts(filter, options);

        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage 
                ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` 
                : null,
            nextLink: result.hasNextPage 
                ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` 
                : null,
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const generateMockProducts = (req, res) => {
    try {
        const mockProducts = MockingModule.generateMockProducts(100);
        res.status(200).json(mockProducts);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao gerar produtos fictícios', error });
    }
};

router.post('/register', registerUser);
router.get('/logout', logoutUser);
router.get('/products', getProducts);
router.get('/mockingproducts', generateMockProducts);

module.exports = router;

const productController = require('../controllers/productController');

router.get('/mockingproducts', productController.getMockProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
